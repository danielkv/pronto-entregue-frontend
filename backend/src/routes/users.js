const Routes = require('express').Router();
const usersController = require('../controller/users');

Routes.post('/users', usersController.create);

module.exports = Routes;