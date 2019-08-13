const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação entre produtos e filiais / empresas
 */

class OptionsGroupsOptionsRel extends Sequelize.Model {};
OptionsGroupsOptionsRel.init({
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
}, {modelName:'options_groups_options_rel', underscored:true, sequelize});

module.exports = OptionsGroupsOptionsRel;