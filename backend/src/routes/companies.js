const Routes = require('express').Router();
const companiesController = require('../controller/companies');
const usersController = require('../controller/users');

Routes.get('/companies/:id', usersController.permit('companies_read'), companiesController.read);
Routes.post('/companies', usersController.permit('master'), companiesController.create);
Routes.put('/companies/:id', usersController.permit('companies_edit'), companiesController.update);
Routes.put('/companies/toggleActive/:id', usersController.permit('companies_edit'), companiesController.toggleActive);

Routes.post('/companies/select', companiesController.select, (req, res)=>{res.send(req.company)});

module.exports = Routes;