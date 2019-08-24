const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de grupos de opções de produtos de pedidos
 */

class OrdersOptionsGroups extends Sequelize.Model {
	static updateAll (groups, product, order_product, transaction=null) {
		groups = groups.filter(group => group.options.length);
		return Promise.all(
			groups.map((group) => {
				return new Promise(async (resolve, reject) => {
					try {
						let group_model, order_group_model;

						if (group.id && group.options_group_relation && group.options_group_relation.id)
							[group_model] = await product.getOptionsGroups({where:{id:group.id}});
						if (!group_model) throw new Error('Esse grupo não existe ou não está vinculado a esse produto');
						
						[order_group_model] = await order_product.getOptionsGroups({where:{id:group.options_group_relation.id}});
						
						if (!order_group_model) {
							[order_group_model] = await order_product.addOptionsGroups(group_model.options_group_relation, {through:group, transaction});
						} else if (group.remove === true) {
							await product.removeOptionsGroup(options_group, {transaction});
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
OrdersOptionsGroups.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
}, {modelName:'orders_options_groups', underscored:true, sequelize});

module.exports = OrdersOptionsGroups;