const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
	host : process.env.MYSQL_HOST,
	dialect : 'mysql',

	pool : {
		max:30,
		min:0,
		idle: 10000,
	},
});

module.exports = conn;