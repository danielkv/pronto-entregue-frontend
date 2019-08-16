const jwt = require('jsonwebtoken');

const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const Roles = require('../model/roles');
const Companies = require('../model/companies');
const {salt} = require('../utilities');
const Notifications = require('../notifications');
require('../utilities');

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
 * Cria novo usuário a partir do id da empresa
 * 
 */

async function create (req, res, next) {
	const user_data = req.body;
	const user_role = await get_allowed_role_creation(req.user || null, user_data.role_id || null);

	user_role.createUser(user_data)
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
	const user_data = req.body;
	const {id} = req.params;
	const update_data = {}

	if (user_data.password === '') delete user_data.password;
	if (user_data.company_id && !req.user.can('master')) throw new Error('Esse usuário não tem permissões para alterar a empresa')
	if (user_data.role_id && !req.user.can('users_edit')) throw new Error('Esse usuário não tem permissão para alterar a função');

	Users
	.findByPk(id)
	.then(user=>{
		if (!user) throw new ReferenceError('Usuário não encontrado');
		update_data.before_update = Object.assign({}, user.get());
		update_data.after_update = Object.filter(user_data, (new_value, key) => user.get(key) && user.get(key) != new_value);

		return user.update(update_data.after_update, {fields:['first_name', 'last_name', 'email', 'password', 'company_id', 'role_id']});
	})
	.then(async (user_updated)=>{
		const return_data = user_updated.get();
		delete return_data.salt;
		delete return_data.password;

		if (user_data.metas) {
			const metas = await UsersMeta.updateAll(user_data.metas, user_updated);
			update_data.after_update.metas = metas;
			return_data.metas = metas;
		}

		return return_data;
	})
	.then((result)=>{
		if (Object.keys(update_data.after_update).length) Notifications.send('update-user', update_data);
		res.send(result);
	})
	.catch(next);
}

/*
 * Função para habilitar/desabilitar usuário
 * 
 */

function toggleActive (req, res, next) {
	Users
	.findByPk(req.params.id)
	.then(user=>{
		if (!user) throw new ReferenceError('Usuário não encontrado');

		return user.update({active:req.body.active});
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
		include : [Companies]
	})
	.then ((user_found)=>{
		//Verifica se encontrou usuário
		if (!user_found) throw new Error('Usuário não encotrado');

		//Verifica se usuário tem empresa relacionada
		if (user_found.companies.length && user_found.role != 'master') throw new Error('Usuário não tem nenhuma empresa relacionada');

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
		if (user_found.active != true) throw new Error('Usuário inativo');

		const countCompanies = await user_found.countCompanies();
		if (countCompanies && user_found.role != 'master') throw new Error('Usuário não tem nenhuma empresa relacionada');

		user_found.permissions = [user_found.role];

		req.user = user_found;

		next();
		return null;
	}).catch(next);
}

/**
 * Verifica usuário autenticado e retorna qual função ele pode criar,
 * caso usuário não esteja autenticado retorna a função cliente (customer)
 * 
 * @param {Users} user 
 * @param {string} role_attempt qual função está tentando definir
 */

async function get_allowed_role_creation(user, role_attempt) {
	let user_role;
	if (user) {
		if (!role_attempt) {
			user_role = await Roles.findOne({where:{name:'customer'}});
		} else {
			user_role = await Roles.findByPk(role_attempt);
		}

		if (user_role.name == 'master' && !user.can('master')) throw new Error('Esse usuário não tem permissões para criar outro usuário com função Master');
		if (user_role.name == 'adm' && !user.can(['adm', 'master'])) throw new Error('Esse usuário não tem permissões para criar outro usuário com função Administrador');
		if (user_role.name != 'customer' && !user.can('users_edit')) throw new Error('Esse usuário não tem permissões para criar outro usuário');
	} else {
		user_role = await Roles.findOne({where:{name:'customer'}});
	}
	return user_role
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

function permit(perms, every=true) {
	return (req, res, next) => {
		if (!req.user) throw new Error('Usuário não autenticado');

		const {user} = req;
		if (!user.can(perms, every)) throw new Error('Você não tem permissões para esta ação');

		next();
		return null;
	}
}

module.exports = {
	read,
	create, //cria usuário
	update,
	toggleActive,

	authorize, //gera token
	authenticate, //verifica token

	permit,
	usersEditPermission,
}