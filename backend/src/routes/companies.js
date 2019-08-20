const Routes = require('express').Router();
const companiesController = require('../controller/companies');
const usersController = require('../controller/users');

Routes.get('/companies',
	companiesController.select,
	companiesController.permissions,
	usersController.permit(['companies_read'], {scope:'adm'}),
	companiesController.read);

Routes.post('/companies',
	usersController.permit('master'),
	companiesController.create);

Routes.put('/companies',
	companiesController.select,
	companiesController.permissions,
	usersController.permit('companies_edit', {scope:'adm'}),
	companiesController.update);

Routes.put('/companies/bind_user/:user_id', 
	companiesController.select,
	companiesController.permissions,
	usersController.permit(['users_read', 'users_edit'], {scope:'adm'}),
	companiesController.bind_user);

Routes.put('/companies/toggle_active',
	companiesController.select,
	companiesController.permissions,
	usersController.permit('companies_edit', {scope:'adm'}),
	companiesController.toggle_active);

module.exports = Routes;