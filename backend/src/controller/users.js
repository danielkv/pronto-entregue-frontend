const jwt = require('jsonwebtoken');

const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const Roles = require('../model/roles');
const Companies = require('../model/companies');
const {salt} = require('../utilities');
const Notifications = require('../notifications');
const sequelize = require('../services/connection');

/*
 * Retorna informações de um usuário a partir do id
 * 
 */

function read (req, res, next) {
	Users.findOne({
		where: {id: req.params.id},
		include:[UsersMeta, Roles],
		attributes:{exclude:['password', 'salt']}
	})
	.then((user)=>{
		if (!user) throw new Error('Usuários não encontrado');
		res.send(user);
	})
	.catch(next);
}

/*
 * Cria novo usuário a partir da empresa
 * 
 */

function create (req, res, next) {
	const {company} = req;
	const user_data = req.body;
	
	sequelize.transaction(async (transaction) => {
		const user_created = await Users.create(user_data, {include: UsersMeta, transaction})
		await company.addUser(user_created, {transaction});
		return user_created;
	})
	.then((user)=>{
		res.send(user);
	})
	.catch(next);
}

/*
 * Atualiza/altera usuário
 * 
 */

function update (req, res, next) {
	const {company} = req;
	const user_data = req.body;
	const {user_id} = req.params;
	const update_data = {}

	if (user_data.password === '') delete user_data.password;
	
	sequelize.transaction(transaction => {
		return company.getUsers({where:{id:user_id}})
		.then(users=>{
			if (!users.length) throw new ReferenceError('Usuário não encontrado');
			const user = users[0];

			update_data.before_update = Object.assign({}, user.get());
			update_data.after_update = Object.filter(user_data, (new_value, key) => user.get(key) && user.get(key) != new_value);

			return user.update(update_data.after_update, {fields:['first_name', 'last_name', 'email', 'password'], transaction});
		})
		.then(async (user_updated)=>{
			const return_data = user_updated.get();
			delete return_data.salt;
			delete return_data.password;

			if (user_data.metas) {
				const metas = await UsersMeta.updateAll(user_data.metas, user_updated, transaction);
				update_data.after_update.metas = metas;
				return_data.metas = metas;
			}

			return return_data;
		})
	})
	.then((result)=>{
		if (Object.keys(update_data.after_update).length) Notifications.send('update-user', update_data);
		res.send(result);
	})
	.catch(next);
}

/**
 * Altera a função geral do usuário dentro da empresa
 */

function update_scope_role (req, res, next) {
	const {user} = req;
	const {user_id} = req.params;
	const {role} = req.body;

	if ((role == 'master' && !user.can('master'))) throw new Error('Você não tem permissão para definir essa função');

	Users.findByPk(user_id)
	.then(user_found => {
		if (!user_found) throw new Error('Usuário não encontrado');

		return user_found.update({role});
	})
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Altera a função de usuário dentro da filial
 * 
 */

function update_branch_role (req, res, next) {
	const {branch} = req;
	const {user_id} = req.params;
	const {role_id} = req.body;

	Promise.all([
		branch.getUsers({where:{id:user_id}}),
		Roles.findByPk(role_id)
	])
	.then(([[user_found], role])=>{
		if (!user_found) throw new Error ('Usuário não encontrado');
		if (!role) throw new Error ('Função não encontrada');

		return user_found.branches_users.setRole(role);
	})
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/*
 * Função para habilitar/desabilitar usuário
 * 
 */

function toggle_active (req, res, next) {
	const {company} = req;
	const {user_id} = req.params;

	company.getUsers({where:{id:user_id}})
	.then(user=>{
		if (!user.length) throw new ReferenceError('Usuário não encontrado');

		return user[0].update({active:req.body.active});
	})
	.then((user_updated)=>{
		const user_return = user_updated.get();
		delete user_return.salt;
		delete user_return.password;

		res.send(user_return);
	})
	.catch(next);
}

/*
 * Autoriza usuário retornando o token com dados,
 * caso autenticação falhe, 'arremessa' um erro
 * 
 */

async function authorize (req, res, next) {
	const {email, password} = req.body;

	//Procura usuário {email}
	Users.findOne({
		where : {email},
	})
	.then ((user_found)=>{
		//Verifica se encontrou usuário
		if (!user_found) throw new Error('Usuário não encotrado');

		//gera token com senha recebidos e salt encontrado e verifica se token salvo é igual
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

		res.send({
			token,
			...authorized,
		});
	})
	.catch(next);
}

/**
 * Faz autenticação de usuário e insere no
 * objeto de requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function authenticate (req, res, next) {
	if (req.path === '/users/authorize') return next(); //Não faz a autenticação em caso de login
	if (!req.headers.authorization && req.path === '/users/create') return next(); //Autenticação não é necessária para criar usuário (cliente)
	
	if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') throw new Error('Autorização desconhecida'); 
	const {id, email} = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, {ignoreExpiration:true});

	Users.findOne({
		where:{id, email},
		attributes: {exclude:['password', 'salt']}
	})
	.then(async (user_found)=>{
		if (!user_found) throw new Error('Usuário não encontrado');
		if (user_found.active != true) throw new Error('Usuário está inativo');

		user_found.permissions = [user_found.role];

		req.user = user_found;

		next();
		return null;
	}).catch(next);
}

/*
 * Middleware para verificar permissão de editar usuário
 * 
 */

function usersEditPermission(req, res, next) {
	if (!req.user) throw new Error('Usuário não foi autenticado');

	const {user} = req;
	const {id} = req.query;

	if (!user.can('users_edit') && user.id != id) throw new Error('Usuário não tem permissão para esta ação');

	next();
	return null;
}

/*
 * Middleware para verificar permissão
 * 
 */

function permit(perms, options) {
	return (req, res, next) => {
		if (!req.user) throw new Error('Usuário não autenticado');

		const {user} = req;
		if (options && typeof options.function == 'function' && options.function(req)){next(); return null;}
		if (!user.can(perms, options)) throw new Error('Você não tem permissões para esta ação');

		next();
		return null;
	}
}

module.exports = {
	//default
	read,
	create,
	update,

	//settings
	toggle_active,
	update_branch_role,
	update_scope_role,

	//authorization
	authorize,
	authenticate,
	
	//permissions
	permit,
	usersEditPermission,
}