const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const Roles = require('../model/roles');
const Companies = require('../model/companies');
const {salt} = require('../utilities');
const jwt = require('jsonwebtoken');

/*
 * Cria novo usuário a partir do id da empresa
 * 
 */

function create (req, res) {
	const user_data = req.body;

	Users
	.create(user_data)
	.then((user)=>{
		res.send(user);
	})
	.catch((err)=>{
		res.status(403).send(err);
	});
}

/*
 * Atualiza/altera usuário
 * 
 */

function update (req, res) {
	const user_data = req.body;
	const {id} = req.query;

	if (user_data.password === '') delete user_data.password;

	Users
	.findOne({
		where : {id},
		include : [UsersMeta],
	})
	.then(user=>user.update(user_data))
	.then((user_updated)=>{
		res.send(user_updated);
	})
	.catch((err)=>{
		res.status(403).send(err);
	});
}

/*
 * Autoriza usuário retornando o token com dados,
 * caso autenticação falhe, 'arremessa' um erro
 * 
 */

async function authorize (req, res) {
	const {company_id, email, password} = req.body;

	//Procura usuário {email, company_id}
	Users.findOne({
		where : {company_id, email},
		include : [Companies]
	})
	.then ((user_found)=>{
		//Verifica se encontrou usuário
		if (!user_found) throw new Error('Email não encotrado');

		//verifica se empresa está ativa
		if (!user_found.company.active) throw new Error('Empresa não está ativa');

		//gera token com senha recebidos e salt encontrado
		//e verifica se token salvo é igual
		const salted = salt(password, user_found.salt);
		if (user_found.password != salted.password) throw new Error('Senha incorreta');
		
		//Gera webtoken com id e email
		const token = jwt.sign({
			id: user_found.id,
			email: user_found.email,
		}, process.env.SECRET);
		
		//Retira campos para retornar usuário
		const authorized = user_found.get();
		delete authorized.password;
		delete authorized.salt;
		delete authorized.role_id;

		res.send({
			token,
			...authorized,
		});
	})
	.catch((err) => {
		res.status(403).send({name: err.name, message: err.message});
	});
}

function authenticate (req, res, next) {
	if (req.path === '/users/authorize') return next(); //Não faz a autenticação em caso de login
	try {
		if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') throw new Error('Autorização desconhecida'); 
		const {id, email} = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, {ignoreExpiration:true});

		Users.findOne({
			where:{id, email},
			include:[{model:Roles, attributes: ['name', 'display_name', 'permissions']}],
			attributes: ['id', 'first_name', 'last_name', 'email', 'active', 'created_at']
		})
		.then((user)=>{
			if (!user) throw new Error('Usuário não encontrado');
			if (user.active != true) throw new Error('Usuário inativo');

			req.user = user;
			next();
		});
	} catch (err) {
		res.status(403).send({name: err.name, message: err.message});
	}
}

function permission(can, every=true) {
	if (!Array.isArray(can)) can = [can];
	return (req, res, next) => {
		try {
			if (!req.user) throw new Error('Usuário não foi autenticado');

			const {permissions} = req.user.role;
			if (!permissions.includes('master')) {
				if (every) {
					if (!can.every(r => permissions.includes(r))) throw new Error('Usuário não tem as permissões para esta ação');
				} else {
					if (!permissions.some(r => can.includes(r))) throw new Error('Usuário não tem permissão para esta ação');
				}
			}

			next();
		} catch (err) {
			res.status(403).send({name: err.name, message: err.message});
		}

	}
}

module.exports = {
	create, //cria usuário
	update,

	authorize, //gera token
	authenticate, //verifica token
	permission,
}