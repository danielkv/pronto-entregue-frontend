const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const OptionsGroups = require('../model/options_groups');

/**
 * Cria pedido a partir da filial e vincula usuário
 * 
 */

function create (req, res, next) {
	const {company, branch} = req;
	const order_data = req.body;

	sequelize.transaction(transaction => {
		return branch.createOrder(order_data, {transaction})
		.then(async (order)=>{
			if (!order) throw new Error('Pedido não pôde ser criada');

			const order_products = await Promise.all(
				order_data.products.map(group => {
					return new Promise(async (resolve, reject)=>{
						try {
							const products_created = await order.createProduct(product_data, {transaction});

							const product_options_groups


						} catch (err) {
							return reject(err);
						}
					})
				})
			)
			const [branch_relation] = await branch.addProduct(created, {through: product_data, transaction});
			const branch_result = {...branch_relation.get()}

			if (product_data.options_groups) {
				branch_result.options_groups = await OptionsGroups.updateAll(product_data.options_groups, company, branch_relation, transaction);
			}

			return {...created.get(), branch_relation:branch_result};
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
 * Retorna um array com produtos vinculados a filial
 * 
 * @query only_active {boolean} filtra apenas ativos. Default: true
 */

function list (req, res, next) {
	const {branch} = req;
	const only_active = req.query.only_active === false || req.query.only_active === 'false' ? req.query.only_active : true;

	branch.getProducts({order:[[Sequelize.literal('branch_relation.order'), 'ASC']], where:{active:only_active}})
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Retorna produto, grupos de opções e opções vinculados a filial
 * 
 * @param product_id {int} ID do produto a ser retornado
 * @query only_active {boolean} filtra apenas ativos. Default: true
 */

function read (req, res, next) {
	const {branch} = req;
	const {product_id} = req.params;
	const only_active = req.query.only_active === false || req.query.only_active === 'false' ? req.query.only_active : true;

	branch.getProducts({where:{id:product_id, active:only_active}})
	.then(async ([product]) => {
		if (!product) throw new Error('Produto não encontrado');

		//busca apenas os grupos
		const options_groups_search = await product.branch_relation.getOptionsGroups({where:{active:only_active}});

		//insere opções dentro dos grupos
		const options_groups = await Promise.all(
			options_groups_search.map(group => {
				return new Promise(async (resolve, reject) => {
					const options = await group.options_group_relation.getOptions({where:{active:only_active}});
					return resolve({...group.get(), options});
				});
			})
		);
		return {...product.get(), options_groups};
	})
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
	const {branch, company} = req;
	const {product_id} = req.params;
	const product_data = req.body;

	sequelize.transaction(transaction => {
		return branch.getProducts({where:{id:product_id}})
		.then(async ([product]) => {
			if (!product) throw new Error('Produto não encontrado');
			let branch_result = {};
			
			if (product_data.category_id) {
				const [category] = await branch.getCategories({where:{id:product_data.category_id}});
				if (category) branch_relation = await product.branch_relation.setCategory(category, {transaction});
			}

			if (Object.keys(product_data).length > 1 || !product_data.category_id) {
				const branch_relation = await product.branch_relation.update(product_data, {fields:['amount', 'order', 'active'], transaction});

				branch_result = {...branch_relation.get()};
				
				if (product_data.options_groups) {
					branch_result.options_groups = await OptionsGroups.updateAll(product_data.options_groups, company, branch_relation, transaction);
				}
			}
			
			return {...product.get(), branch_relation:branch_result};
		});
	})
	.then((updated)=>{
		return res.send(updated);
	})
	.catch(next);
}

module.exports = {
	//default
	create,
	list, 
	read,
	update,

	//settings
	bind,
	unbind,
}