const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

const ProductsBranchesRel = conn.define('products_branches_rel', {
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
});

module.exports = ProductsBranchesRel;