const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de categorias de produtos
 */

class ProductsCategories extends Sequelize.Model {};
ProductsCategories.init({
	name: Sequelize.STRING,
	image: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	order: Sequelize.INTEGER,
}, {modelName:'products_categories', underscored:true, sequelize, name:{singular:'category', plural:'categories'}});

module.exports = ProductsCategories;