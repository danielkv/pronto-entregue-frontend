const Routes = require('express').Router();
const paymentMethodsController = require('../controller/payment_methods');
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

//DEFAULT MIDDLESWARES
Routes.use(companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['branches_edit', 'payment_methods_edit'], {scope:'adm'}));
	
Routes.get('/branches/payment_methods/', paymentMethodsController.read);

Routes.post('/branches/payment_methods', paymentMethodsController.add);

Routes.put('/branches/payment_methods/:payment_method_id', paymentMethodsController.update);

Routes.delete('/branches/payment_methods/:payment_method_id', paymentMethodsController.remove);

module.exports = Routes;