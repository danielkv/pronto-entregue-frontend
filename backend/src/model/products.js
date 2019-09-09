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
	image: Sequelize.TEXT,
	order: Sequelize.INTEGER,
	type: {
		type: Sequelize.STRING(50),
		comment: 'single | multiple',
		validate: {
			isIn : {
				args : [['single', 'multiple']],
				msg: 'Tipo de produto inválido'
			}
		}
	},
	price: {
		type: Sequelize.DECIMAL(10, 2),
		set (val) {
			if (typeof val == 'string')
				this.setDataValue('price', parseFloat(val.replace(/\,/g, '.')));
			else
				this.setDataValue('price', val);
		},
		get () {
			return parseFloat(this.getDataValue('price'));
		}
	},
}, {modelName:'products', underscored:true, sequelize});

module.exports = Products;