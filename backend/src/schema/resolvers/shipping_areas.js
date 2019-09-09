//const ShippingAreas = require('../model/shipping_areas');
//const sequelize = require('../services/connection');

/**
 * Cria local de entrega a partir de filial
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function create (req, res, next) {
	const {branch} = req;
	const shipping_area_data = req.body;

	branch.createShippingArea(shipping_area_data)
	.then((created_shipping_area)=>{
		return res.send(created_shipping_area);
	})
	.catch(next);
}

/**
 * Retorna locais de entrega vinculados à filial
 */

function read (req, res, next) {
	const {branch} = req;
	
	branch.getShippingAreas()
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Atualiza/altera local de entrega
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function update (req, res, next) {
	const {branch} = req;
	const {shipping_area_id} = req.params;
	const shipping_area_data = req.body;

	branch.getShippingAreas({where:{id:shipping_area_id}})
	.then(([shipping_area]) => {
		if (!shipping_area) throw new Error('Local de entrega não encontrado');

		return shipping_area.update(shipping_area_data, {fields:['name', 'zipcodes', 'price']});
	})
	.then((updated)=>{
		return res.send(updated);
	})
	.catch(next);
}

/**
 * Remove local de entrega
 * => remove o registro do banco de dados
 * 
 */

function remove (req, res, next) {
	const {branch} = req;
	const {shipping_area_id} = req.params;

	branch.getShippingAreas({where:{id:shipping_area_id}})
	.then(([shipping_area]) => {
		if (!shipping_area) throw new Error('Local de entrega não encontrado');

		return shipping_area.destroy();
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
	remove,
}