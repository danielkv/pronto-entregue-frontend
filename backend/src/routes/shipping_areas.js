const Routes = require('express').Router();
const shippingAreasController = require('../controller/shipping_areas');
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

//DEFAULT MIDDLESWARES
Routes.use('/',
	companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['branches_edit', 'shipping_areas_edit'], {scope:'adm'}));

Routes.post('/', shippingAreasController.create);

Routes.put('/:shipping_area_id', shippingAreasController.update);

Routes.delete('/:shipping_area_id', shippingAreasController.remove);

Routes.get('/', shippingAreasController.read);

module.exports = Routes;