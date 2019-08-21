const Routes = require('express').Router();
const multer = require('multer');

const multerConfig = require('../config/multer');
const productCategoriesController = require('../controller/products_categories');
const usersController = require('../controller/users');
const companiesController = require('../controller/companies');
const branchesController = require('../controller/branches');

//DEFAULT MIDDLESWARES
Routes.use(companiesController.select,
	companiesController.permissions,
	branchesController.select,
	branchesController.permissions,
	usersController.permit(['products_edit'], {scope:'adm'}));

Routes.post('/branches/products_categories', multer(multerConfig).single('image'), productCategoriesController.create);

Routes.put('/branches/products_categories/:category_id', multer(multerConfig).single('image'), productCategoriesController.update);

Routes.put('/branches/products_categories/toggle_active/:category_id', productCategoriesController.toggle_active);

Routes.delete('/branches/products_categories/:category_id', productCategoriesController.remove);

Routes.get('/branches/products_categories/',	productCategoriesController.read);

module.exports = Routes;