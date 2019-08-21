const Routes = require('express').Router();
const multer = require('multer');

const multerConfig = require('../config/multer');
const productsController = require('../controller/products');
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

//DEFAULT MIDDLESWARES
Routes.use(companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['products_edit'], {scope:'adm'}));

Routes.post('/companies/products', multer(multerConfig).single('image'), productsController.create);

Routes.put('/companies/products/:product_id', multer(multerConfig).single('image'), productsController.update);

Routes.put('/companies/products/toggle_active/:product_id', productsController.toggle_active);

Routes.get('/companies/products/',	productsController.read);

module.exports = Routes;