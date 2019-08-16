const Routes = require('express').Router();
const usersController = require('../controller/users');

Routes.get('/users/:id', usersController.permit('users_read'), usersController.read);
Routes.post('/users', usersController.create);
Routes.put('/users/:id', usersController.usersEditPermission, usersController.update);
Routes.put('/users/toggleActive/:id', usersController.permit('users_edit'), usersController.toggleActive);

Routes.post('/users/authorize', usersController.authorize);
Routes.post('/users/authenticate', (req, res)=>{res.send(req.user)});

module.exports = Routes;