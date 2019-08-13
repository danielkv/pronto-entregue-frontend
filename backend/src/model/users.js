const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const {salt} = require('../utilities');
const jwt = require('jsonwebtoken');

/*
 * Define modelo (tabela) de usuários
 */

class Users extends Sequelize.Model {
	/*
	* Autoriza usuário retornando o token com dados,
	* caso autenticação falhe, 'arremessa' um erro
	*/
	
	authorize (password) {
		const salted = salt(password, this.salt);
		if (this.password != salted.password) throw new Error('Senha incorreta');
		
		const token = jwt.sign({
			id: this.id,
			email: this.email,
		}, process.env.SECRET);
		
		const authorized = this.get();
		delete authorized.password;
		delete authorized.salt;
		delete authorized.role_id;

		return {
			token,
			...authorized,
		};
	}
}

Users.init({
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	salt: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	//role_id: Sequelize.TEXT, -> Criado em 'relations'
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

/*
 * Adiciona o salt para senha do usuário
 *
 */

Users.addHook('beforeCreate', 'saltPassword', (user, options)=> {
	const salted = salt(user.password);
	
	user.salt = salted.salt;
	user.password = salted.password;
});

/* async function authenticate (token) {

	let user = await jwt.verify(token);
	if (!user.id || !user.email) throw {code:'incorrect_token', message:'Não foi possível autenticar o token'};

	let user_exists = await get({id: user.id, email : user.email});
	if (user_exists.length != 1) throw {code: 'user_not_found', message:`Usuário não encontrado`};

	user_exists = user_exists[0];
	if (user_exists.active != true) throw {code: 'inactive_user', message:'Usuário inativo'};

	return user_exists;
} */

module.exports = Users;