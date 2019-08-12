const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de produtos
 */

const Products = conn.define('products', {
	name: Sequelize.STRING,
	image: Sequelize.STRING,
	type: Sequelize.TEXT, //single | multiple
	amount: Sequelize.DECIMAL(10, 2),
	order: Sequelize.INTEGER
});

module.exports = Products;