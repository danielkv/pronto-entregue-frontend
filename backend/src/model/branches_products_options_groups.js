const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class ProductsOptionsGroups extends Sequelize.Model {};
ProductsOptionsGroups.init({
	name: Sequelize.STRING,
	type: Sequelize.STRING(50),
	min_select: Sequelize.INTEGER,
	max_select: Sequelize.INTEGER,
	restrain_other_option_group: Sequelize.INTEGER, // id de outro grupo de opções para restringir
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	order: Sequelize.INTEGER
}, {modelName:'product_ralation', tableName:'branches_products_options_groups', underscored:true, sequelize});

module.exports = ProductsOptionsGroups;