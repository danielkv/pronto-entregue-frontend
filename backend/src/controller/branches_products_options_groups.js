const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/**
 * Cria groupo de opções a partir da empresa e vincula à filial
 * 
 */

function create (req, res, next) {
	const {company, branch} = req;
	const group_data = req.body;

	if (req.file) product_data.image = req.file.path;

	sequelize.transaction(transaction => {
		company.createOptionsGroup(group_data, {transaction})
		.then(async (group)=>{
			const [branch_relation] = group.setBranch(branch, {through:group_data});
			return {...group.get(), branch_relation};
		});
	})
	.then((created)=>{
		return res.send(created);
	})
	.catch(next);
}

/**
 * Vincula grupo de opções a filial
 * 
 */

function bind (req, res, next) {
	const {company, branch} = req;
	const {group_id} = req.params;
	const group_data = req.body;

	company.getOptionsGroups({where:{id:group_id}})
	.then(async ([group])=>{
		if (!group) throw new Error('Grupo de opções não encontrado');

		const [branch_relation] = await branch.addOptionsGroups(group, {through: group_data});
		return {...group.get(), branch_relation};
	})
	.then((binded)=>{
		return res.send(binded);
	})
	.catch(next);
}

/**
 * Desvincula grupo de opções da filial
 * 
 */

function unbind (req, res, next) {
	const {branch} = req;
	const {group_id} = req.params;

	branch.getOptionsGroups({where:{id:group_id}})
	.then(async ([group])=>{
		if (!group) throw new Error('Grupo de opções não encontrado');

		return branch.removeProduct(group);
	})
	.then((unbinded)=>{
		return res.send({message:'Grupo de opções desvinculado'});
	})
	.catch(next);
}

/**
 * Retorna grupo de opções vinculados a filial
 * 
 * @query only_active {boolean} filtra apenas ativos. Default: true
 */

function read (req, res, next) {
	const {branch} = req;

	const only_active = req.query.only_active === false || req.query.only_active === 'false' ? req.query.only_active : true;

	branch.getOptionsGroups({where:{active:only_active}, order:[[Sequelize.literal('branch_relation.order'), 'ASC']]})
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Atualiza/altera vinculo do produto com a filial
 * 
 * update [amount, order]
 */

function update (req, res, next) {
	const {branch} = req;
	const {group_id} = req.params;
	const group_data = req.body;

	sequelize.transaction(transaction => {
		return branch.getOptionsGroups({where:{id:group_id}})
		.then(async ([group]) => {
			if (!group) throw new Error('Produto não encontrado');
			let branch_relation;

			if (group_data.restrain_other_id) {
				const [otherGroup] = await branch.getOptionsGroups({where:{id:restrain_other_id}});
				if (otherGroup) branch_relation = group.setRestrainOtherGroup(otherGroup, {transaction});
			}

			if (Object.keys(group_data).length > 1 || !group_data.restrain_other_id)
				branch_relation = await group.branch_relation.update(group_data, {fields:['type', 'min_select', 'max_select', 'active', 'order'], transaction});

			return {...group.get(), branch_relation};
		})
	})
	.then((updated)=>{
		return res.send(updated);
	})
	.catch(next);
}

module.exports = {
	//default
	create,
	read,
	update,

	//settings
	bind,
	unbind,
}