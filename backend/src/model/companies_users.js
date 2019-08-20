const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de relação de empresas e usuários
 */

class CompaniesUsers extends Sequelize.Model {};
CompaniesUsers.init({
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement:true
	},
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
}, {modelName:'companies_users', underscored:true, sequelize, name:{singular:'CompanyUser', plural:'CompaniesUsers'}});

module.exports = CompaniesUsers;