const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const OrdersOptionsGroups = require('./orders_options_groups');

/*
 * Define modelo (tabela) de pedidos
 */

class OrdersProducts extends Sequelize.Model {
	static updateAll(products, order, transaction) {
		return Promise.all(
			products.map(product => {
				return new Promise(async (resolve, reject)=>{
					try {
						let order_product, options_groups = [];
						if (!product.id) throw new Error('Esse produto não existe');
						
						[order_product] = await order.getProducts({where:{id:product.id}});

						if (!order_product) {
							let product_id = product.id;
							delete product.id;
							order_product = await order.createProduct({...product, product_id}, {transaction});
						} else {
							if (product.remove === true) await order.removeProduct(product, {transaction});
							else order_product = await order_product.update(product, {fields:['message', 'amount'], transaction});
						}
						
						if (!product.remove && product.options_groups)
							options_groups = await OrdersOptionsGroups.updateAll(product.options_groups, order_product, transaction);

						return resolve({...order_product.get(), options_groups});
					} catch (err) {
						return reject(err);
					}
				})
			})
		)
	}
};
OrdersProducts.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
	amount: Sequelize.DECIMAL(10,2),
	message: Sequelize.STRING,
}, {modelName:'orders_products', underscored:true, sequelize});

module.exports = OrdersProducts;