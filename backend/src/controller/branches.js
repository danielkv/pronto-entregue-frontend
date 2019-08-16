const Branches = require('../model/branches');
const BranchesMeta = require('../model/branches_meta');
const Users = require('../model/users');

/*
 * Retorna informações de uma empresa a partir do id
 */

function read (req, res, next) {
	const {id} = req.params;

	Branches
	.findOne({
		where : {id},
		include : [BranchesMeta],
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
	company_data.users.role_id = 2; //adm

	Branches
	.create(company_data, {include:[Users, BranchesMeta]})
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
	
	Branches.findByPk(id)
	.then(company=>{
		if (!company) throw new ReferenceError('Empresa não encontrada');
		update_data.before_update = Object.assign({}, company.get());
		update_data.after_update = Object.filter(company_data, (new_value, key) => company.get(key) && company.get(key) != new_value);

		return company.update(company_data, {fields:['name', 'display_name']})
	})
	.then(async (company_updated)=>{
		const return_data = company_updated.get();

		if (company_data.metas) {
			const metas = await BranchesMeta.updateAll(company_data.metas, company_updated);
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

/*
 * Função para habilitar/desabilitar usuário
 * 
 */

function toggleActive (req, res, next) {
	Branches
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
}