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
	amount: {
		type: Sequelize.DECIMAL(10, 2),
		set (val) {
			if (typeof val == 'string')
				this.setDataValue('amount', parseFloat(val.replace(/\,/g, '.')));
			else
				this.setDataValue('amount', val);
		},
		get () {
			return parseFloat(this.getDataValue('amount'));
		}
	},
	discount: {
		type: Sequelize.DECIMAL(10, 2),
		set (val) {
			if (typeof val == 'string')
				this.setDataValue('amount', parseFloat(val.replace(/\,/g, '.')));
			else
				this.setDataValue('amount', val);
		},
		get () {
			return parseFloat(this.getDataValue('amount'));
		}
	},
	status: {
		type: Sequelize.STRING,
		comment: 'waiting | preparation | delivery | delivered | canceled',
		defaultValue : 'waiting',
		allowNull : false,
		validate : {
			isIn : [['waiting', 'preparation', 'delivery', 'delivered', 'canceled']],
		}
	},
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