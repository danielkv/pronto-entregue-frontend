const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

const OptionsGroupsOptionsRel = conn.define('options_groups_options_rel', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	type: Sequelize.STRING(50),
	amount: Sequelize.DECIMAL(10,2),
	max_select_restrain_other: Sequelize.INTEGER, // id de outro grupo de opções para restringir
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	order: Sequelize.INTEGER
});

module.exports = OptionsGroupsOptionsRel;