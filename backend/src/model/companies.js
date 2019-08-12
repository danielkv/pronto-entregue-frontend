const conn = require('../services/connection');
const Sequelize = require('sequelize');

const Companies = conn.define('companies', {
	name: Sequelize.STRING,
	display_name: Sequelize.STRING,
	/* phone: Sequelize.STRING,
	email: Sequelize.STRING,
	document: Sequelize.STRING,
	contact: Sequelize.STRING,
	contact_phone: Sequelize.STRING,
	contact_email: Sequelize.STRING, */
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
});

module.exports = Companies;