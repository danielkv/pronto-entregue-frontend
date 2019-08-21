//const ShippingAreas = require('../model/shipping_areas');
//const sequelize = require('../services/connection');

/**
 * Cria categoria a partir de filial
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function create (req, res, next) {
	const {branch} = req;
	const category_data = req.body;

	if (req.file) category_data.image = req.file.path;

	branch.createCategory(category_data)
	.then((created_category)=>{
		return res.send(created_category);
	})
	.catch(next);
}

/**
 * Retorna categorias vinculadas à filial
 */

function read (req, res, next) {
	const {branch} = req;
	
	branch.getCategories()
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Atualiza/altera categoria
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function update (req, res, next) {
	const {branch} = req;
	const {category_id} = req.params;
	const category_data = req.body;

	if (req.file) category_data.image = req.file.path;

	branch.getCategories({where:{id:category_id}})
	.then(([category_found]) => {
		if (!category_found) throw new Error('Categoria não encontrada');

		return category_found.update(category_data, {fields:['name', 'image', 'active', 'order']});
	})
	.then((updated)=>{
		return res.send(updated);
	})
	.catch(next);
}

/**
 * Remove Categoria
 * => remove o registro do banco de dados
 * 
 */

function remove (req, res, next) {
	const {branch} = req;
	const {category_id} = req.params;
	const category_data = req.body;

	branch.getCategories({where:{id:category_id}})
	.then(([category_found]) => {
		if (!category_found) throw new Error('Categoria não encontrado');

		return category_found.destroy();
	})
	.then((removed)=>{
		return res.send(removed);
	})
	.catch(next);
}

module.exports = {
	//default
	create,
	read,
	update,
	remove,
}