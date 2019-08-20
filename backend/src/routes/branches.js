const Routes = require('express').Router();
const branchesController = require('../controller/branches');
const companiesController = require('../controller/companies');
const usersController = require('../controller/users');

Routes.get('/branches',
	companiesController.select,
	companiesController.permissions,
	usersController.permit(['companies_read'], {scope:'adm'}),
	branchesController.select,
	branchesController.read);

Routes.post('/branches',
	companiesController.select,
	usersController.permit('adm'), 
	branchesController.create);

Routes.put('/branches/bind_user/:user_id', 
	companiesController.select,
	companiesController.permissions,
	usersController.permit(['branches_edit', 'users_edit'], {scope:'adm'}),
	branchesController.select,
	branchesController.bind_user);

Routes.put('/branches/', 
	companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit('branches_edit', {scope:'adm'}),
	branchesController.update);

/*Routes.put('/branches/toggleActive/',
	companiesController.select,
	branchesController.select,
	usersController.permit('branches_edit'),
	branchesController.toggleActive); */


module.exports = Routes;