const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de métodos de pagamentos das filiais
 */

class BranchesPaymentMethods extends Sequelize.Model {};
BranchesPaymentMethods.init({
	fee: Sequelize.DECIMAL(10,2),
}, {modelName:'branches_payment_methods', underscored:true, sequelize});

module.exports = BranchesPaymentMethods;