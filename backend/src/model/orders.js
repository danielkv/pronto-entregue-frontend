const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de pedidos
 */

class Orders extends Sequelize.Model {};
Orders.init({
	//branch_id => criado em 'relations'
	//user_id => criado em 'relations'
	//payment_method_id => criado em 'relations'

	//Dados principais
	payment_fee: Sequelize.DECIMAL(10,2),
	shipping_amount: Sequelize.STRING,
	amount: Sequelize.DECIMAL(10,2),
	discount: Sequelize.STRING,
	status: Sequelize.STRING,
	message: Sequelize.TEXT,

	//Endereço da entrega
	street: Sequelize.STRING,
	number: Sequelize.INTEGER,
	complement: Sequelize.STRING,
	city: Sequelize.STRING,
	state: Sequelize.STRING,
	district: Sequelize.STRING,
	zipcode: Sequelize.STRING,
}, {modelName:'orders', underscored:true, sequelize});

module.exports = Orders;