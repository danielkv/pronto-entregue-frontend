
/**
 * Cria produto a partir da empresa
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function create (req, res, next) {
	const {company} = req;
	const product_data = req.body;

	if (req.file) product_data.image = req.file.path;

	company.createProduct(product_data)
	.then((created_product)=>{
		return res.send(created_product);
	})
	.catch(next);
}

/**
 * Retorna produtos vinculados a empresa
 */

function read (req, res, next) {
	const {company} = req;
	
	company.getProducts()
	.then((result)=>{
		res.send(result);
	})
	.catch(next);
}

/**
 * Atualiza/altera produto
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function update (req, res, next) {
	const {company} = req;
	const {product_id} = req.params;
	const product_data = req.body;

	if (req.file) product_data.image = req.file.path;

	company.getProducts({where:{id:product_id}})
	.then(([product]) => {
		if (!product) throw new Error('Produto não encontrado');

		return product.update(product_data, {fields:['name', 'image', 'type', 'amount']});
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
	const {company} = req;
	const {product_id} = req.params;

	const active = req.body.active;

	company.getProducts({where:{id:product_id}})
	.then(([product]) => {
		if (!product) throw new Error('Produto não encontrado');

		return product.update({active});
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
}