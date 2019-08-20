const Routes = require('express').Router();
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');

Routes.get('/users/:user_id',
	companiesController.select,
	usersController.permit('users_read', {scope:'adm'}),
	usersController.read);

Routes.post('/users',
	companiesController.select,
	usersController.create);

Routes.put('/users/:user_id',
	companiesController.select,
	usersController.permit('users_edit', {function:(req)=>(req.user.get('id')==req.params.user_id)}),
	usersController.update);

Routes.put('/users/toggleActive/:user_id',
	usersController.permit('users_edit'),
	usersController.toggleActive);

Routes.post('/users/authorize', usersController.authorize);
Routes.post('/users/authenticate', (req, res)=>{res.send(req.user)});

module.exports = Routes;