const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de filiais
 */

class Branches extends Sequelize.Model {};
Branches.init({
	display_name: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
}, {modelName:'branches', underscored:true, sequelize});

module.exports = Branches;