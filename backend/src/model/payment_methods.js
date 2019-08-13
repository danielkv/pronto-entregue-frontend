const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de pedidos
 */

const PaymentMethods = conn.define('payment_methods', {
	name: Sequelize.STRING,
	display_name: Sequelize.STRING,
	meta: Sequelize.TEXT,
});

module.exports = PaymentMethods;