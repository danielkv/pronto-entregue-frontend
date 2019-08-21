const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class BranchesProducts extends Sequelize.Model {};
BranchesProducts.init({
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	amount: {
		type: Sequelize.DECIMAL(10, 2),
		defaultValue: 0,
		set (val) {
			if (typeof val == 'string')
				this.setDataValue('amount', parseFloat(val.replace(/\,/g, '.')));
			else
				this.setDataValue('amount', val);
		},
		get () {
			return parseFloat(this.getDataValue('amount'));
		}
	},
	order: {
		type: Sequelize.INTEGER,
		defaultValue : 0,
	},
}, {modelName:'branch_relation', tableName:'branches_products', underscored:true, sequelize});

module.exports = BranchesProducts;