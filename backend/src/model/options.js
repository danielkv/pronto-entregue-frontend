const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de opções
 */

const Options = conn.define('options', {
	name: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
});

module.exports = Options;