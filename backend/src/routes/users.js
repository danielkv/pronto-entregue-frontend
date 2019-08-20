const Routes = require('express').Router();
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

Routes.get('/users/:user_id',
	companiesController.select,
	usersController.permit('users_read', {scope:'adm'}),
	usersController.read);

Routes.post('/users',
	companiesController.select,
	usersController.create);

Routes.put('/users/:user_id',
	companiesController.select,
	usersController.permit('users_edit', {function:(req)=>(req.user.get('id')==req.params.user_id), scope:'adm'}),
	usersController.update);

Routes.put('/users/toggle_active/:user_id',
	companiesController.select,
	companiesController.permissions,
	usersController.permit('users_edit', {scope:'adm'}),
	usersController.toggle_active);

Routes.put('/users/update_branch_role/:user_id',
	companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['users_edit', 'roles_edit'], {scope:'adm'}),
	usersController.update_branch_role);

Routes.put('/users/update_branch_role/:user_id',
	companiesController.select,
	companiesController.permissions,
	usersController.permit('adm'),
	usersController.update_branch_role);

//--------------Authorizations----------------

Routes.post('/users/authorize',
	usersController.authorize);

Routes.post('/users/authenticate',
	(req, res)=>{res.send(req.user)});

module.exports = Routes;