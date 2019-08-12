const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

const CompaniesMeta = conn.define('companies_meta', {
	meta_type: {
		type:Sequelize.STRING,
		comment: 'phone | email | document | business_hours | address | ...',
	},
	meta_value: Sequelize.TEXT,
});

module.exports = CompaniesMeta;