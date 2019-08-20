const Companies = require('../model/companies');
const Branches = require('../model/branches');
const BranchesMeta = require('../model/branches_meta');
const Users = require('../model/users');
const sequelize = require('../services/connection');

/*
 * Retrona as informações da filial
 */

function read (req, res, next) {
	if (!(req.branch instanceof Branches)) throw new Error('Filial não encontrada');

	const {branch} = req;
	
	branch.getMetas()
	.then((metas)=> {
		res.send({...branch.get(), metas});
	})
	.catch(next);
}

/*
 * Cria nova filial para empresa
 */

function create (req, res, next) {
	if (!(req.company instanceof Companies)) throw new Error('Empresa não encontrada');

	const company = req.company;
	const branch_data = req.body;

	branch_data.active = true;
	
	sequelize.transaction(transaction => {
		return company.createBranch(branch_data, {include:[BranchesMeta], transaction})
	})
	.then((branch)=> {
		res.send(branch);
	})
	.catch(next);
}

/*
 * Atualizar dados da filial
 */

function update(req, res, next) {
	if (!(req.branch instanceof Branches)) throw new Error('Filial não encontrada');

	const {branch} = req;
	const branch_data = req.body;
	const update_data = {};

	update_data.before_update = Object.assign({}, branch.get());
	update_data.after_update = Object.filter(branch_data, (new_value, key) => branch.get(key) && branch.get(key) != new_value);

	sequelize.transaction(transaction => {
		return branch.update(branch_data, {fields:['name'], transaction})
		.then(async (branch_updated)=>{
			const return_data = branch_updated.get();

			if (branch_data.metas) {
				const metas = await BranchesMeta.updateAll(branch_data.metas, branch_updated, transaction);
				update_data.after_update.metas = metas;
				return_data.metas = metas;
			}

			return return_data;
		})
	})
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Vincula/Desvincula usuário (params) à filial (headers)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

async function bind_user(req, res, next) {
	try {
		if (!(req.company instanceof Companies)) throw new Error('Empresa não encontrada');
		if (!(req.branch instanceof Branches)) throw new Error('Filial não encontrada');

		const action = req.body.action == 'bind' ? 'bind' : 'unbind';
		
		const {branch} = req;
		const bind_user = await req.company.getUsers({where:{id:req.params.user_id}});
		if (!bind_user.length) throw new Error('O usuário selecionado não existe ou não está vinculado a essa empresa');

		if (action == 'bind') {
			branch.addUser(bind_user[0], {through:{active:true}})
			.then(([result])=>{
				if (result == 1) return res.send({message: 'Usuário já está vinculado a esta filial'});
				res.send({...bind_user[0].get(), branches_users:result});
			});
		} else {
			branch.removeUsers(bind_user)
			.then((result)=>{
				res.send({message:'Usuário desvinculado'});
			});
		}
	} catch (err) {
		next(err);
	}
}

/**
 * Faz a seleção da filial e insere no objeto de requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function select (req, res, next) {
	if (!(req.company instanceof Companies)) throw new Error('Empresa não encontrada');
	if (!req.headers.branch_id) throw new Error('Filial não selecionada');
	
	const {company} = req;
	const {branch_id} = req.headers;

	company.getBranches({where:{id:branch_id}})
	.then(async (branches_found)=>{
		if (!branches_found.length) throw new Error('Filial selecionada não foi encontrada');
		
		const branch_found = branches_found[0];
		if (!branch_found.active) throw new Error('Essa filial não está ativa');

		req.branch = branch_found;
		next();
		return null;
	}).catch(next);
}

/**
 * Procura o vinculo entre usuário e filial e insere 
 * as permissões na requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

async function permissions (req, res, next) {
	if (!(req.branch instanceof Branches)) throw new Error('Filial não encontrada');
	if (!(req.user instanceof Users)) throw new Error('Usuário não encontrado');
	
	const {user, branch} = req;

	if (!user.can('master')) {
		const assigned_user = await branch.getUsers({where:{id:user.id}});
		if (!assigned_user.length || !assigned_user[0].branches_users.active) throw new Error('Você não tem as permissões para acessar essa filial');

		const role = await assigned_user[0].branches_users.getRole();
		req.user.branch_permissions = role.permissions;
	}

	next();
}

/*
 * Função para habilitar/desabilitar usuário
 * 
 */

function toggleActive (req, res, next) {
	if (!(req.branch instanceof Branches)) new Error('Filial não encontrada');

	req.branch.update({active:req.body.active})
	.then((branch_updated)=>{
		res.send(branch_updated.get());
	})
	.catch(next);
}

module.exports = {
	read,
	create,
	update,
	toggleActive,

	select,
	permissions,

	bind_user,
}