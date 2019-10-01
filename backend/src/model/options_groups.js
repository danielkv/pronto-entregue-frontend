const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const Options = require('../model/options');

/*
 * Define modelo (tabela) de grupos de opções
 */

class OptionsGroups extends Sequelize.Model {
	static updateAll (groups, product, transaction=null) {
		return Promise.all(
			groups.map((group) => {
				let group_model;
				return new Promise(async (resolve, reject) => {
					try {
						if (!['create', 'remove', 'update'].includes(group.action)) return resolve(group);

						if (group.id && group.action === "remove") {
							group_model = await product.removeOptionsGroup(group_model, {transaction});
							return resolve(group_model);
						} else if (group.action === 'create') {
							group_model = await product.createOptionsGroup(group, {transaction});
						} else if (group.id && group.action === 'update') {
							[group_model] = await product.getOptionsGroups({where:{id:group.id}});
							console.log(group);
							group_model = await group_model.update(group, {fields:['name', 'type', 'min_select', 'max_select', 'order', 'max_select_restrain'], transaction});
						}
						
						if (group_model) {
							if (!group.remove && group.options) group.options = await Options.updateAll(group.options, group_model, transaction);
							return resolve({...group_model.get(), options: group.options});
						} else {
							reject('Grupo não foi encontrado');
						}
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
	order: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull:false,
		validate : {
			notEmpty:{msg:'Você deve definir uma ordem'},
			notNull:{msg:'Você deve definir uma ordem'},
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