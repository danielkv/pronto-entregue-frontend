const Routes = require('express').Router();

const branchesProductsOptionsGroupsController = require('../controller/branches_products_options_groups');
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

//DEFAULT MIDDLESWARES
Routes.use(companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['products_edit'], {scope:'adm'}));

Routes.post('/', branchesProductsOptionsGroupsController.create);

Routes.put('/:product_id', branchesProductsOptionsGroupsController.update);

Routes.put('/bind/:product_id', branchesProductsOptionsGroupsController.bind);

Routes.put('/unbind/:product_id', branchesProductsOptionsGroupsController.unbind);

Routes.get('/', branchesProductsOptionsGroupsController.read);

module.exports = Routes;