/*
 * Essa é a configuração todas relações e chaves 
 * estrangeiras entre todas as tabelas.
 * 
 * Esse arquivo roda a partir do setup.js
 */

const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Branches = require('../model/branches');
const BranchesPaymentMethods = require('../model/branches_payment_methods');
const BranchesMeta = require('../model/branches_meta');
const PaymentMethods = require('../model/payment_methods');
const ShippingAreas = require('../model/shipping_areas');

const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const Roles = require('../model/roles');

const ProductsCategories = require('../model/products_categories');
const Products = require('../model/products');
const OptionsGroups = require('../model/options_groups');
const Options = require('../model/options');

const ProductsBranchesRel = require('../model/products_branches_rel');
const ProductsOptionsGroupsRel = require('../model/products_options_groups_rel');
const OptionsGroupsOptionsRel = require('../model/options_groups_options_rel');

const Orders = require('../model/orders');
const OrdersProducts = require('../model/orders_products');
const OrdersOptionsGroups = require('../model/orders_options_groups');
const OrdersOptions = require('../model/orders_options');

//Companies Relations
Companies.hasMany(Users);
Companies.hasMany(Branches);
Companies.hasMany(CompaniesMeta);

//Branches Relations
Branches.hasMany(BranchesMeta);
Branches.hasMany(Orders);
Branches.hasMany(ShippingAreas);

//PaymentMethods
PaymentMethods.belongsToMany(Branches, {through:BranchesPaymentMethods});

//Users relations
Users.belongsTo(Roles);
Users.hasMany(UsersMeta);
Users.hasMany(Orders);

//Products relations
Products.belongsTo(ProductsCategories);
Products.belongsTo(Companies);
Products.belongsToMany(Branches, {through: ProductsBranchesRel});
Products.belongsToMany(Orders, {through: {model: OrdersProducts, unique:false}}); //order

//OptionsGroups relations
OptionsGroups.belongsToMany(Options, {through:OptionsGroupsOptionsRel});
OptionsGroups.belongsToMany(Products, {through:ProductsOptionsGroupsRel});
OptionsGroups.belongsToMany(OrdersProducts, {through:{model:OrdersOptionsGroups, unique:false}});  //order

//Options relations
Options.belongsToMany(OrdersOptionsGroups, {through:{model:OrdersOptions, unique:false}});  //order

//Orders relations
Orders.belongsTo(BranchesPaymentMethods);  //order