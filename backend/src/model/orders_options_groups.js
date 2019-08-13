const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de grupos de opções de produtos de pedidos
 */

class OrdersOptionsGroups extends Sequelize.Model {};
OrdersOptionsGroups.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	name: Sequelize.STRING,
}, {modelName:'orders_options_groups', underscored:true, sequelize});

module.exports = OrdersOptionsGroups;