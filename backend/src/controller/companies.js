const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const CompaniesUsers = require('../model/companies_users');
const Users = require('../model/users');
const Roles = require('../model/roles');
const UsersMeta = require('../model/users_meta');

/*
 * Retorna informações de uma empresa a partir do id
 */

function read (req, res, next) {
	const {id} = req.params;

	Companies
	.findOne({
		where : {id},
		include : [CompaniesMeta],
	})
	.then((company)=> {
		if (!company) throw new Error('Empresa não encontrada');

		res.send(company);
	})
	.catch(next);
}

/*
 * Cria empresa e usuário ADM
 */

function create (req, res, next) {
	const company_data = req.body;

	company_data.active = false;

	Promise.all([
		Companies.create(company_data, {include:[CompaniesMeta]}),
		Users.create(company_data.users, {include:[UsersMeta]}),
	])
	
	.then (([company, user])=>{
		company.addUser(user, {through:{role_id:2}});
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
	if (!req.user) throw new Error('Usuário não autenticado');
	if (!req.query.company_id) throw new Error('Empresa não selecionada');

	const user = req.user;
	const {company_id} = req.query;

	Companies.findOne({where:{id:company_id}})
	.then(async (company_found)=>{
		if (!company_found) throw new Error('Empresa selecionada não foi encontrada');
		if (!company_found.active) throw new Error('Essa empresa não está ativa');

		if (!user.can('master')) {
			const company_users = await company_found.getUsers({where:{id:user.id, active:true}});
			if (!company_users || !company_users[0].companies_users.active) throw new Error('Esse usuário não tem permissões para acessar essa empresa');

			const role = await company_users[0].companies_users.getRole();
			req.user.permissions = [...req.user.permissions, ...role.permissions];
		}

		req.company = company_found;
		next();
	}).catch(next);
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
}