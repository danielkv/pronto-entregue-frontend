const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de pedidos
 */

const OrdersProducts = conn.define('orders_products', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
	amount: Sequelize.DECIMAL(10,2),
	message: Sequelize.STRING,
});

module.exports = OrdersProducts;