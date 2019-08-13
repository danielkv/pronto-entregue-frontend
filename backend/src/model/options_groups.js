const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de grupos de opções
 */

class OptionsGroups extends Sequelize.Model {};
OptionsGroups.init({
	name: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
}, {modelName:'options_groups', underscored:true, sequelize});

module.exports = OptionsGroups;