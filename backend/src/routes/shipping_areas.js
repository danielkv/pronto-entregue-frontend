const Routes = require('express').Router();
const shippingAreasController = require('../controller/shipping_areas');
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

//DEFAULT MIDDLESWARES
Routes.use(companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['branches_edit', 'shipping_areas_edit'], {scope:'adm'}));

Routes.post('/branches/shipping_areas', shippingAreasController.create);

Routes.put('/branches/shipping_areas/:shipping_area_id', shippingAreasController.update);

Routes.delete('/branches/shipping_areas/:shipping_area_id', shippingAreasController.remove);

Routes.get('/branches/shipping_areas/',	shippingAreasController.read);

module.exports = Routes;