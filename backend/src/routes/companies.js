const Routes = require('express').Router();
const companiesController = require('../controller/companies');
const usersController = require('../controller/users');

Routes.post('/companies', usersController.permission('master'), companiesController.create);
Routes.put('/companies', usersController.permission('companies_edit'), companiesController.update);

module.exports = Routes;