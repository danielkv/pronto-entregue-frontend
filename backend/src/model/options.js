const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de opções
 */

class Options extends Sequelize.Model {
	static updateAll (options, group_model, transaction=null) {
		return Promise.all(
			options.map(async (option) => {
				let option_model;
				if (option.id && option.action !== 'create') [option_model] = await group_model.getOptions({where:{id:option.id}});
	
				if (option_model) {
					if (option.action === "remove") return group_model.removeOption(option_model, {transaction});
					else if (option.action === "update") return option_model.update(option, {fields:['name', 'amount', 'active', 'order', 'max_select_restrain_other'], transaction});
				} else {
					return group_model.createOption({...option}, {transaction});
				}

				return option;
			})
		);
	}
};
Options.init({
	name: Sequelize.STRING,
	order: Sequelize.INTEGER,
	max_select_restrain_other:Sequelize.INTEGER,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	amount: {
		type: Sequelize.DECIMAL(10, 2),
		set (val) {
			if (typeof val == 'string')
				this.setDataValue('amount', parseFloat(val.replace(/\,/g, '.')));
			else
				this.setDataValue('amount', val);
		},
		get () {
			return parseFloat(this.getDataValue('amount'));
		}
	},
}, {modelName:'options', underscored:true, sequelize, name:{singular:'option', plural:'options'}});

module.exports = Options;