const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de grupos de opções
 */

const OptionsGroups = conn.define('options_groups', {
	name: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
});

module.exports = OptionsGroups;