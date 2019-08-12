const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de permissões
 */

const Roles = conn.define('roles', {
	name: Sequelize.STRING,
	display_name: Sequelize.STRING,
	permissions: Sequelize.TEXT,
});

module.exports = Roles;