const Routes = require('express').Router();

const {errorHandler} = require('../controller/errorsHandler');
const usersConstroller = require('../controller/users');

const usersRoutes = require('../routes/users');

const companiesRoutes = require('../routes/companies');
const productsCategoriesRoutes = require('../routes/products_categories');
const optionsGroupsRoutes = require('../routes/options_groups');

const branchesRoutes = require('../routes/branches');
const shippingAreasRoutes = require('../routes/shipping_areas');
const paymentMethodsRoutes = require('../routes/payment_methods');
const branchesProductsRoutes = require('../routes/branches_products');

const productsRoutes = require('../routes/products');

//Rota de autenticação Autenticação
Routes.use(usersConstroller.authenticate);

//Rotas
Routes.use('/users', usersRoutes);

Routes.use('/companies', companiesRoutes);
Routes.use('/companies/products', productsRoutes);
Routes.use('/companies/options_groups', optionsGroupsRoutes);
	
Routes.use('/branches', branchesRoutes);
Routes.use('/branches/categories', productsCategoriesRoutes);
Routes.use('/branches/shipping_areas', shippingAreasRoutes);
Routes.use('/branches/payment_methods', paymentMethodsRoutes);

Routes.use('/products', branchesProductsRoutes);

//Maniupulação de erros
Routes.use(errorHandler);

module.exports = Routes;