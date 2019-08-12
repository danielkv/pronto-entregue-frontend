/*
 * Essa é a configuração todas relações e chaves 
 * estrangeiras entre todas as tabelas.
 * 
 * Esse arquivo roda a partir do setup.js
 */

const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Branches = require('../model/branches');
const BranchesMeta = require('../model/branches_meta');
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
const PaymentMethods = require('../model/payment_methods');

//Companies Relations
Companies.hasMany(Users, {foreignKey:'company_id'});
Companies.hasMany(Branches, {foreignKey:'company_id'});
Companies.hasMany(CompaniesMeta, {foreignKey:'company_id'});

//Branches Relations
Branches.hasMany(BranchesMeta, {foreignKey:'branch_id'});
Branches.hasMany(Orders, {foreignKey:'branch_id'});
Branches.hasMany(ShippingAreas, {foreignKey:'branch_id'});

//Users relations
Users.belongsTo(Roles, {foreignKey:'role_id'});
Users.hasMany(UsersMeta, {foreignKey:'user_id'});
Users.hasMany(Orders, {foreignKey:'user_id'});

//Products relations
Products.belongsTo(ProductsCategories, {foreignKey:'category_id'});
Products.hasOne(Companies, {foreignKey:'company_id'});
Products.belongsToMany(Branches, {through: ProductsBranchesRel, foreignKey:'product_id', otherKey:'branch_id'});
Products.belongsToMany(Orders, {through: {model: OrdersProducts, unique:false}, foreignKey:'product_id', otherKey:'order_id'}); //order

//OptionsGroups relations
OptionsGroups.belongsToMany(Options, {through:OptionsGroupsOptionsRel, foreignKey:'option_group_id', otherKey:'option_id'});
OptionsGroups.belongsToMany(Products, {through:ProductsOptionsGroupsRel, foreignKey:'option_group_id', otherKey:'product_id'});
OptionsGroups.belongsToMany(OrdersProducts, {through:{model:OrdersOptionsGroups, unique:false}, foreignKey:'option_group_id', otherKey:'order_product_id'});  //order

//Options relations
Options.belongsToMany(OrdersOptionsGroups, {through:{model:OrdersOptions, unique:false}, foreignKey:'options_id', otherKey:'order_option_id', unique:false});  //order

//Orders relations
Orders.belongsTo(PaymentMethods, {foreignKey:'payment_method_id'});  //order