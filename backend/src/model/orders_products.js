const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de pedidos
 */

class OrdersProducts extends Sequelize.Model {};
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