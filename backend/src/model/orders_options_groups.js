const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de grupos de opções de produtos de pedidos
 */

const OrdersOptionsGroups = conn.define('orders_options_groups', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
});

module.exports = OrdersOptionsGroups;