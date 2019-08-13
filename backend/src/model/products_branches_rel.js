const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class ProductsBranchesRel extends Sequelize.Model {};
ProductsBranchesRel.init({
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
}, {modelName:'products_branches_rel', underscored:true, sequelize});

module.exports = ProductsBranchesRel;