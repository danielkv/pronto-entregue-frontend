const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const Options = require('../model/options');

/*
 * Define modelo (tabela) de grupos de opções
 */

class OptionsGroups extends Sequelize.Model {
	static updateAll (groups, product, transaction=null) {
		let group_model;
	
		return Promise.all(
			groups.map((group) => {
				return new Promise(async (resolve, reject) => {
					try {
						if (group.id) [group_model] = await product.getOptionsGroups({where:{id:group.id}});
						
						if (group_model) {
							if (group.remove === true) await product.removeOptionsGroup(group_model, {transaction});
							else await group_model.update(group, {fields:['name', 'type', 'min_select', 'max_select', 'order', 'max_select_restrained_by'], transaction});
						} else {
							group_model = await product.createOptionsGroup(group, {transaction});
						}
						
						if (!group.remove && group.options) group.options = await Options.updateAll(group.options, group_model, transaction);
						
						return resolve({...group_model.get(), options: group.options});
					} catch (err) {
						return reject(err);
					}
				});
			})
		);
	}
};

OptionsGroups.init({
	name: Sequelize.STRING,
	type: {
		type: Sequelize.STRING(50),
		comment: 'single | multiple',
		validate: {
			isIn : {
				args : [['single', 'multiple']],
				msg: 'Tipo de grupo inválido'
			}
		}
	},
	min_select: Sequelize.INTEGER,
	max_select: Sequelize.INTEGER,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
}, {modelName:'options_groups', underscored:true, sequelize, name:{singular:'OptionsGroup', plural:'OptionsGroups'}});

module.exports = OptionsGroups;