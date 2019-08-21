const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de produtos
 */

class Products extends Sequelize.Model {};
Products.init({
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	name: Sequelize.STRING,
	image: Sequelize.STRING,
	type: {
		type: Sequelize.TEXT,
		comment: 'single | multiple',
		validate: {
			isIn : {
				args : [['single', 'multiple']],
				msg: 'Tipo de produto inválido'
			}
		}
	},
	amount: {
		type: Sequelize.DECIMAL(10, 2),
		set (val) {
			this.setDataValue('amount', parseFloat(val.replace(/\,/g, '.')));
		},
		get () {
			return parseFloat(this.getDataValue('amount'));
		}
	},
}, {modelName:'products', underscored:true, sequelize});

module.exports = Products;