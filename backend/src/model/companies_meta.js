const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class CompaniesMeta extends Sequelize.Model {};
CompaniesMeta.init({
	meta_type: {
		type:Sequelize.STRING,
		comment: 'phone | email | document | business_hours | address | ...',
	},
	meta_value: Sequelize.TEXT,
}, {modelName:'companies_meta', underscored:true, sequelize});

module.exports = CompaniesMeta;