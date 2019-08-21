const Routes = require('express').Router();

const {errorHandler} = require('../controller/errorsHandler');
const usersConstroller = require('../controller/users');

const companiesRoutes = require('../routes/companies');
const usersRoutes = require('../routes/users');
const branchesRoutes = require('../routes/branches');
const shippingAreasRoutes = require('../routes/shipping_areas');
const paymentMethodsRoutes = require('../routes/payment_methods');

const productsCategoriesRoutes = require('../routes/products_categories');
const productsRoutes = require('../routes/products');

//Rota de autenticação Autenticação
Routes.use(usersConstroller.authenticate);

//Rotas
Routes.use(companiesRoutes);
Routes.use(usersRoutes);
Routes.use(branchesRoutes);
Routes.use(shippingAreasRoutes);
Routes.use(paymentMethodsRoutes);
Routes.use(productsCategoriesRoutes);
Routes.use(productsRoutes);

//Maniupulação de erros
Routes.use(errorHandler);

module.exports = Routes;