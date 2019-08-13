const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de usuários
 */

class UsersMeta extends Sequelize.Model {};
UsersMeta.init({
	meta_type: {
		type:Sequelize.STRING,
		comment: 'phone | email | document | business_hours | address | ...',
	},
	meta_value: Sequelize.TEXT,
}, {modelName:'users_meta', underscored:true, sequelize});

module.exports = UsersMeta;