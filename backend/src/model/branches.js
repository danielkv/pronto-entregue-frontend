const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de filiais
 */

const Branches = conn.define('branches', {
	display_name: Sequelize.STRING,
});

module.exports = Branches;