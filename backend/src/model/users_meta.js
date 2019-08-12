const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de usuários
 */

const UsersMeta = conn.define('users_meta', {
	meta_type: {
		type:Sequelize.STRING,
		comment: 'phone | email | document | business_hours | address | ...',
	},
	meta_value: Sequelize.TEXT,
});

module.exports = UsersMeta;