const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const OrdersOptions = require('./orders_options');

/*
 * Define modelo (tabela) de grupos de opções de produtos de pedidos
 */

class OrdersOptionsGroups extends Sequelize.Model {
	static updateAll (groups, product, transaction=null) {
		return Promise.all(
			groups.map((group) => {
				return new Promise(async (resolve, reject) => {
					let group_model;
					try {
						if (!group.id) throw new Error('Esse grupo de opções não existe');
						
						[group_model] = await product.getOptionsGroups({where:{id:group.id}});
						
						if (group_model) {
							if (group.remove === true) await product.removeOptionsGroup(group_model, {transaction});
						} else {
							let options_group_id = group.id;
							delete group.id;
							group_model = await product.createOptionsGroup({...group, options_group_id}, {transaction});
						}
						
						if (!group.remove && group.options) group.options = await OrdersOptions.updateAll(group.options, group_model, transaction);
						
						return resolve({...group_model.get(), options: group.options});
					} catch (err) {
						return reject(err);
					}
				});
			})
		);
	}
};
OrdersOptionsGroups.init({
	name: Sequelize.STRING,
	type: {
		type: Sequelize.STRING(50),
		comment: 'single | multiple',
		
	},
}, {modelName:'orders_options_groups', underscored:true, sequelize});

module.exports = OrdersOptionsGroups;