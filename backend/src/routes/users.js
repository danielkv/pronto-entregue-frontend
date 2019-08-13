const Routes = require('express').Router();
const usersController = require('../controller/users');

Routes.post('/users', usersController.create);
Routes.post('/users/authorize', usersController.authorize);

module.exports = Routes;