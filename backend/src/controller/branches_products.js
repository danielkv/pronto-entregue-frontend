const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/**
 * Cria produto a partir da empresa e vincula à filial
 * 
 */

function create (req, res, next) {
	const {company, branch} = req;
	const product_data = req.body;

	if (req.file) product_data.image = req.file.path;

	sequelize.transaction(transaction => {
		return branch.getCategories({where:{id:product_data.category_id}})
		.then(async ([category])=>{
			if (!category) throw new Error('Categoria não encontrada');

			const created = await company.createProduct(product_data, {transaction});
			const [branch_relation] = await branch.addProduct(created, {through:{category_id: category.id, amount: product_data.amount}, transaction});
			return {...created.get(), branch_relation};
		});
	})
	.then((created)=>{
		return res.send(created);
	})
	.catch(next);
}

/**
 * Vincula produto à filial
 * 
 */

function bind (req, res, next) {
	const {company, branch} = req;
	const {product_id} = req.params;
	const product_data = req.body;

	Promise.all([
		company.getProducts({where:{id:product_id}}),
		branch.getCategories({where:{id:product_data.category_id}}),
	])
	.then(async ([[product], [category]])=>{
		if (!product) throw new Error('Produto não encontrado');
		if (!category) throw new Error('Categoria não encontrada');

		const [branch_relation] = await branch.addProduct(product, {through: product_data});
		return {...product.get(), branch_relation};
	})
	.then((binded)=>{
		return res.send(binded);
	})
	.catch(next);
}

/**
 * Desvincula produto à filial
 * 
 */

function unbind (req, res, next) {
	const {branch} = req;
	const {product_id} = req.params;

	branch.getProducts({where:{id:product_id}})
	.then(async ([product])=>{
		if (!product) throw new Error('Produto não encontrado');

		return branch.removeProduct(product);
	})
	.then((binded)=>{
		return res.send({message:'Produto desvinculado'});
	})
	.catch(next);
}

/**
 * Retorna produtos vinculados a filial
 */

function read (req, res, next) {
	const {branch} = req;

	branch.getProducts({order:[[Sequelize.literal('branch_relation.order'), 'ASC']]})
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
	const {product_id} = req.params;
	const product_data = req.body;

	branch.getProducts({where:{id:product_id}})
	.then(async ([product]) => {
		if (!product) throw new Error('Produto não encontrado');

		const branch_relation = await product.branch_relation.update(product_data, {fields:['amount', 'order']});
		return {...product.get(), branch_relation};
	})
	.then((updated)=>{
		return res.send(updated);
	})
	.catch(next);
}

/**
 * Atualiza/altera categoria do produto da filial
 * 
 */

function update_category (req, res, next) {
	const {branch} = req;
	const {product_id} = req.params;
	const {category_id} = req.body;

	Promise.all([
		branch.getProducts({where:{id:product_id}}),
		branch.getCategories({where:{id:category_id}}),
	])
	.then(async ([[product], [category]]) => {
		if (!product) throw new Error('O Produto não existe ou não está vinculado à filial');
		if (!category) throw new Error('Categoria não encontrada');

		const branch_relation = await product.branch_relation.setCategory(category);
		return {...product.get(), branch_relation};
	})
	.then((updated)=>{
		return res.send(updated);
	})
	.catch(next);
}

/**
 * Ativa/Desativa produto
 * => não é possível remover produtos, apenas desativa-los
 * 
 */

function toggle_active (req, res, next) {
	const {branch} = req;
	const {product_id} = req.params;

	const active = req.body.active;

	branch.getProducts({where:{id:product_id}})
	.then(async ([product]) => {
		if (!product) throw new Error('Produto não encontrado');

		const branch_relation = await product.branch_relation.update({active});
		return {...product.get(), branch_relation};
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
	toggle_active,
	update_category,
	bind,
	unbind,
}