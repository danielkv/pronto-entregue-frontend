const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de categorias de produtos
 */

const ProductsCategories = conn.define('products_categories', {
	name: Sequelize.STRING,
	image: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	order: Sequelize.INTEGER,
});

module.exports = ProductsCategories;