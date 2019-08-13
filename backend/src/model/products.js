const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de produtos
 */

class Products extends Sequelize.Model {};
Products.init({
	name: Sequelize.STRING,
	image: Sequelize.STRING,
	type: Sequelize.TEXT, //single | multiple
	amount: Sequelize.DECIMAL(10, 2),
	order: Sequelize.INTEGER
}, {modelName:'products', underscored:true, sequelize});

module.exports = Products;