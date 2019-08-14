const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const {salt} = require('../utilities');

/*
 * Define modelo (tabela) de usuários
 */

class Users extends Sequelize.Model {
	get fullName() {
		return `${this.first_name} ${this.last_name}`;
	}
}
Users.init({
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: {
		type: Sequelize.STRING,
		allowNull:false,
		set(val) {
			//Adiciona o salt para salvar a senha do usuário
			const salted = salt(val);
			this.setDataValue('password', salted.password);
			this.setDataValue('salt', salted.salt);
		}
	},
	salt: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	//role_id: => Criado em 'relations'
},{
	modelName : 'users', //nome da tabela
	underscored:true,
	indexes : [ //Evita criação de 2 emails para mesma empresa
		{
			unique : true,
			fields : ['company_id', 'email'],
		}
	],
	sequelize,
});

module.exports = Users;