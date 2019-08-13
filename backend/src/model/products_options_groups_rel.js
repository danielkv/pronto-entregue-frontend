const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class ProductsOptionsGroupsRel extends Sequelize.Model {};
ProductsOptionsGroupsRel.init({
	type: Sequelize.STRING(50),
	min_select: Sequelize.INTEGER,
	max_select: Sequelize.INTEGER,
	restrain_other_option_group: Sequelize.INTEGER, // id de outro grupo de opções para restringir
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	order: Sequelize.INTEGER
}, {modelName:'products_options_groups_rel', underscored:true, sequelize});

module.exports = ProductsOptionsGroupsRel;