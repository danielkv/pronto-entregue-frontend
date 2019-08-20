/*
 * Essa é a configuração todas relações e chaves 
 * estrangeiras entre todas as tabelas.
 * 
 * Esse arquivo roda a partir do setup.js
 */

const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const CompaniesUsers = require('../model/companies_users');
const Branches = require('../model/branches');
const BranchesPaymentMethods = require('../model/branches_payment_methods');
const BranchesMeta = require('../model/branches_meta');
const BranchesUsers = require('../model/branches_users');
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
Companies.hasMany(Branches, {foreignKey:'company_id'});
Companies.hasMany(CompaniesMeta, {foreignKey:'company_id'});
Companies.belongsToMany(Users, {through:CompaniesUsers, foreignKey:'company_id', otherKey:'user_id'});

//Roles relations
Roles.hasMany(BranchesUsers, {foreignKey:'role_id'});

//Branches Relations
Branches.hasMany(BranchesMeta, {foreignKey:'branch_id'});
Branches.hasMany(Orders, {foreignKey:'branch_id'});
Branches.hasMany(ShippingAreas, {foreignKey:'branch_id'});
Branches.belongsToMany(PaymentMethods, {through:BranchesPaymentMethods, foreignKey:'branch_id', otherKey:'payment_method_id'});
Branches.belongsToMany(Users, {through:BranchesUsers, foreignKey:'branch_id', otherKey:'user_id'});

//BranchesUsers relations
BranchesUsers.belongsTo(Roles, {foreignKey:'role_id'});

//PaymentMethods
PaymentMethods.belongsToMany(Branches, {through:BranchesPaymentMethods, foreignKey:'payment_method_id', otherKey:'branch_id'});

//Users relations
Users.hasMany(UsersMeta, {foreignKey:'user_id'});
Users.hasMany(Orders, {foreignKey:'user_id'});
Users.belongsToMany(Companies, {through:CompaniesUsers, foreignKey:'user_id', otherKey:'company_id'});
Users.belongsToMany(Branches, {through:BranchesUsers, foreignKey:'user_id', otherKey:'branch_id'});

//UsersMeta
UsersMeta.belongsTo(Users, {foreignKey:'user_id'});

//Products relations
Products.belongsTo(ProductsCategories, {foreignKey:'products_category_id'});
Products.belongsTo(Companies, {foreignKey:'company_id'});
Products.belongsToMany(Branches, {through: ProductsBranchesRel, foreignKey:'product_id', otherKey:'branch_id'});
Products.belongsToMany(Orders, {through: {model: OrdersProducts, unique:false}, foreignKey:'product_id', otherKey:'order_id'}); //order

//OptionsGroups relations
OptionsGroups.belongsToMany(Options, {through:OptionsGroupsOptionsRel, foreignKey:'options_group_id', otherKey:'option_id'});
OptionsGroups.belongsToMany(Products, {through:ProductsOptionsGroupsRel, foreignKey:'options_group_id', otherKey:'product_id'});
OptionsGroups.belongsToMany(OrdersProducts, {through:{model:OrdersOptionsGroups, unique:false}, foreignKey:'options_group_id', otherKey:'orders_product_id'});  //order

//Options relations
Options.belongsToMany(OrdersOptionsGroups, {through:{model:OrdersOptions, unique:false}, foreignKey:'option_id', otherKey:'orders_options_group_id'});  //order

//Orders relations
Orders.belongsTo(BranchesPaymentMethods, {foreignKey:'branches_payment_method_id'});  //order