const Routes = require('express').Router();
const companiesController = require('../controller/companies');
const usersController = require('../controller/users');

Routes.get('/companies/:id', companiesController.select, usersController.permit('companies_read'), (req, res)=>{res.send(req.company)});
Routes.post('/companies', usersController.permit('master'), companiesController.create);
Routes.put('/companies/:id', usersController.permit('companies_edit'), companiesController.update);
Routes.put('/companies/toggleActive/:id', usersController.permit('companies_edit'), companiesController.toggleActive);

module.exports = Routes;