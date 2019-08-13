const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de opções de produtos de pedidos
 */

class OrdersOptions extends Sequelize.Model {};
OrdersOptions.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
	amount: Sequelize.DECIMAL(10,2),
}, {modelName:'orders_options', underscored:true, sequelize});

module.exports = OrdersOptions;