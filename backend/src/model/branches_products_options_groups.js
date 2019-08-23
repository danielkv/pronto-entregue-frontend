const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class BranchesProductsOptionsGroups extends Sequelize.Model {};

BranchesProductsOptionsGroups.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	min_select: Sequelize.INTEGER,
	max_select: Sequelize.INTEGER,
	order: Sequelize.INTEGER,
}, {modelName:'options_group_relation', tableName:'branches_products_options_groups', underscored:true, sequelize});

module.exports = BranchesProductsOptionsGroups;