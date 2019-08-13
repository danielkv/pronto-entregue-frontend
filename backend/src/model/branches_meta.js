const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de metadata para as filiais
 */

class BranchesMeta extends Sequelize.Model {};
BranchesMeta.init({
	meta_type: {
		type:Sequelize.STRING,
		comment: 'phone | email | document | business_hours | address | ...',
	},
	meta_value: Sequelize.TEXT,
}, {modelName:'branches_meta', underscored:true, sequelize});

module.exports = BranchesMeta;