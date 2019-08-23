const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const Options = require('../model/options');

/*
 * Define modelo (tabela) de grupos de opções
 */

class OptionsGroups extends Sequelize.Model {
	static updateAll (groups, company, product, transaction=null) {
		let group_model, options_group;
	
		return Promise.all(
			groups.map((group) => {
				return new Promise(async (resolve, reject) => {
					try {
						if (group.id) [options_group] = await product.getOptionsGroups({where:{id:group.id}});
						
						if (options_group) {
							group_model = options_group.options_group_relation;
							if (group.remove === true) await product.removeOptionsGroup(group_model, {transaction});
							else await group_model.update(group, {fields:['min_select', 'max_select', 'order', 'max_select_restrained_by'], transaction});
						} else {
							let _group;
							if (group.id) [_group] = await company.getOptionsGroups({where:{id:group.id}});
							if (!_group) _group = await company.createOptionsGroup(group, {transaction});

							[group_model] = await product.addOptionsGroups(_group, {through:group, transaction});
						}
						
						if (!group.remove && group.options) group.options = await Options.updateAll(group.options, group_model, company, transaction);
						
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