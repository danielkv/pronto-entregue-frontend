const Routes = require('express').Router();
const companiesController = require('../controller/companies');

Routes.post('/companies', companiesController.create);
Routes.put('/companies', companiesController.update);

module.exports = Routes;