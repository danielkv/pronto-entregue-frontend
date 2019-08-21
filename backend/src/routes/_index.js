const Routes = require('express').Router();

const {errorHandler} = require('../controller/errorsHandler');
const usersConstroller = require('../controller/users');

const companiesRoutes = require('../routes/companies');
const usersRoutes = require('../routes/users');
const branchesRoutes = require('../routes/branches');
const shippingAreasRoutes = require('../routes/shipping_areas');
const paymentMethodsRoutes = require('../routes/payment_methods');
const productsCategoriesRoutes = require('../routes/product_categories');

//Rota de autenticação Autenticação
Routes.use(usersConstroller.authenticate);

//Rotas
Routes.use(companiesRoutes);
Routes.use(usersRoutes);
Routes.use(branchesRoutes);
Routes.use(shippingAreasRoutes);
Routes.use(paymentMethodsRoutes);
Routes.use(productsCategoriesRoutes);

//Maniupulação de erros
Routes.use(errorHandler);

module.exports = Routes;