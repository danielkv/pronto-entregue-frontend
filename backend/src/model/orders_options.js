const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de opções de produtos de pedidos
 */

const OrdersOptions = conn.define('orders_options', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
	amount: Sequelize.DECIMAL(10,2),
});

module.exports = OrdersOptions;