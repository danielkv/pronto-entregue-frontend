const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');

/*
 * Retrona as informações da filial
 */

function read (req, res, next) {
	if (!(req.company instanceof Companies)) throw new Error('Empresa não encontrada');

	const {company} = req;
	
	company.getMetas()
	.then((metas)=> {
		res.send({...company.get(), metas});
	})
	.catch(next);
}

/*
 * Cria empresa e usuário ADM
 */

function create (req, res, next) {
	const company_data = req.body;

	company_data.active = false;
	company_data.users.role = 'adm';
	company_data.users.active = 1;

	Promise.all([
		Companies.create(company_data, {include:[CompaniesMeta]}),
		Users.create(company_data.users, {include:[UsersMeta]}),
	])
	
	.then (([company, user])=>{
		company.addUser(user, {through:{active:true}});
		return {company, user};
	})
	.then((result)=> {
		res.send(result);
	})
	.catch(next);
}

/*
 * Atualizar dados da empresa
 */

function update(req, res, next) {
	const {id} = req.params;
	const company_data = req.body;
	const update_data = {};
	
	Companies.findByPk(id)
	.then(company=>{
		if (!company) throw new ReferenceError('Empresa não encontrada');
		update_data.before_update = Object.assign({}, company.get());
		update_data.after_update = Object.filter(company_data, (new_value, key) => company.get(key) && company.get(key) != new_value);

		return company.update(company_data, {fields:['name', 'display_name']})
	})
	.then(async (company_updated)=>{
		const return_data = company_updated.get();

		if (company_data.metas) {
			const metas = await CompaniesMeta.updateAll(company_data.metas, company_updated);
			update_data.after_update.metas = metas;
			return_data.metas = metas;
		}

		return return_data;
	})
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Faz a seleção da empresa e das permissões para empresa
 * para os próximos middlewares e insere no object de requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function select (req, res, next) {
	if (!(req.user instanceof Users)) throw new Error('Usuário não autenticado');
	if (!req.headers.company_id) throw new Error('Empresa não selecionada');
	
	const {company_id} = req.headers;

	Companies.findOne({where:{id:company_id}})
	.then(async (company_found)=>{
		if (!company_found) throw new Error('Empresa selecionada não foi encontrada');
		if (!company_found.active) throw new Error('Essa empresa não está ativa');

		req.company = company_found;
		return next();
	}).catch(next);
}

/**
 * Procura o vinculo entre usuário e empresa e insere 
 * as permissões na requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

async function permissions (req, res, next) {
	if (!(req.company instanceof Companies)) throw new Error('Empresa não encontrada');
	
	const {user, company} = req;

	if (!user.can('master')) {
		const assigned_user = await company.getUsers({where:{id:user.id}});
		if (!assigned_user.length || !assigned_user[0].companies_users.active) throw new Error('Você não tem as permissões para acessar essa empresa');

		//Até aqui permissões são MASTER, ADM ou DEFAULT, definidas na autenticação
	}

	next();
	return null;
}

/*
 * Função para habilitar/desabilitar usuário
 * 
 */

function toggleActive (req, res, next) {
	Companies
	.findByPk(req.params.id)
	.then(company=>{
		if (!company) throw new ReferenceError('Empresa não encontrada');

		return company.update({active:req.body.active});
	})
	.then((company_updated)=>{
		res.send(company_updated.get());
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
}