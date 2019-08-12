const conn = require('../services/connection');
const Sequelize = require('sequelize');
const crypto = require('crypto');
//const jwt = require('jsonwebtoken');

/*
 * Define modelo (tabela) de usuários
 */

const Users = conn.define('users', {
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	salt: Sequelize.STRING,
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
	//role: Sequelize.TEXT,
},{
	indexes : [
		{
			unique : true,
			fields : ['company_id', 'email'],
		}
	]
});

//Users.sync({force:true});

/*
 * Adiciona o salt para senha do usuário
 *
 */

Users.addHook('beforeCreate', 'saltPassword', (user, options)=> {
	const salted = salt(user.password);
	
	user.salt = salted.salt;
	user.password = salted.password;
});

/*
 * Cria o salt para ser adicionado/verificar senha do usuário
 *
 */

function salt(password, salt=null) {
	const _salt = salt || crypto.randomBytes(16).toString('hex');
	var hash = crypto.createHmac('sha512', _salt);
	hash.update(password);
	let _password = hash.digest('hex');
	return {
		password:_password,
		salt:_salt,
	}
}

/* async function exists (user) {
	const user_exists = await get({email : user.email});
	if (user_exists.length) throw {code: 'user_exists', message:`Esse email (${user.email}) já foi cadastrado no banco de dados`};
	return user;
} */

/* async function authorize (email, password) {
	let user_exists = await get({email : email}, ['salt']);
	if (user_exists.length != 1) throw {code: 'user_not_found', message:`Usuário não encontrado`};

	user_exists = user_exists[0];
	if (user_exists.active != true) throw {code: 'inactive_user', message:'Usuário inativo'};

	const salted = salt(password, user_exists.salt);

	let user = await get({email : email, password:salted.password});
	if (user.length != 1) throw {code: 'password_incorrect', message:`Senha incorreta`};
	user = user[0];
	
	const token = await jwt.sign({
		id:user.id,
		email:user.email,
	});

	return {
		token,
		...user,
	};
} */

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