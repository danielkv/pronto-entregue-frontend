const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de opções de produtos de pedidos
 */

class OrdersOptions extends Sequelize.Model {
	static updateAll (options, group_model, transaction=null) {
		return Promise.all(
			options.map(async (option) => {
				let option_model;
				if (!option.id) throw new Error('Essa opção não existe');
				
				[option_model] = await group_model.getOptions({where:{id:option.id}});
	
				if (option_model) {
					if (option.remove === true) return group_model.removeOption(option_model, {transaction});
				} else {
					delete option.id;
					return group_model.createOption(option, {transaction});
				}
			})
		);
	}
};
OrdersOptions.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
	price: {
		type: Sequelize.DECIMAL(10, 2),
		set (val) {
			if (typeof val == 'string')
				this.setDataValue('price', parseFloat(val.replace(/\,/g, '.')));
			else
				this.setDataValue('price', val);
		},
		get () {
			return parseFloat(this.getDataValue('price'));
		}
	},
}, {modelName:'orders_options', underscored:true, sequelize});

module.exports = OrdersOptions;