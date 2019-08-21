const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class ProductsBranches extends Sequelize.Model {};
ProductsBranches.init({
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	amount: {
		type: Sequelize.DECIMAL(10, 2),
		defaultValue: 0,
	},
	order: {
		type: Sequelize.INTEGER,
		defaultValue : 0,
	},
}, {modelName:'products_branches', underscored:true, sequelize});

module.exports = ProductsBranches;