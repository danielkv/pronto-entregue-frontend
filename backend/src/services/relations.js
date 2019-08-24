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
const Items = require('../model/items');

const BranchesProducts = require('../model/branches_products');

const Orders = require('../model/orders');
const OrdersProducts = require('../model/orders_products');
const OrdersOptionsGroups = require('../model/orders_options_groups');
const OrdersOptions = require('../model/orders_options');

//Companies Relations
Companies.hasMany(Products, {foreignKey:'company_id'});
Companies.hasMany(Branches, {foreignKey:'company_id'});
Companies.hasMany(CompaniesMeta, {foreignKey:'company_id'});
Companies.belongsToMany(Users, {through:CompaniesUsers, foreignKey:'company_id', otherKey:'user_id'});

//Roles relations
Roles.hasMany(BranchesUsers, {foreignKey:'role_id'});

//Branches Relations
Branches.hasMany(BranchesMeta, {foreignKey:'branch_id'});
Branches.hasMany(Orders, {foreignKey:'branch_id'});
Branches.hasMany(ShippingAreas, {foreignKey:'branch_id'});
Branches.hasMany(ProductsCategories, {foreignKey:'branch_id'});
Branches.belongsToMany(PaymentMethods, {through:BranchesPaymentMethods, foreignKey:'branch_id', otherKey:'payment_method_id'});
Branches.belongsToMany(Users, {through:BranchesUsers, foreignKey:'branch_id', otherKey:'user_id'});
Branches.belongsToMany(Products, {through: BranchesProducts, foreignKey:'branch_id', otherKey:'product_id'});

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

//ProductsCategories relations
ProductsCategories.hasMany(BranchesProducts, {foreignKey:'category_id'});
ProductsCategories.belongsTo(Branches, {foreignKey:'branch_id'});

//Products relations
Products.belongsTo(Companies, {foreignKey:'company_id'}); 

//BranchesProducts relations
//BranchesProducts.belongsToMany(Orders, {through: {model: OrdersProducts, unique:false}, foreignKey:'product_id', otherKey:'order_id'}); //order
BranchesProducts.belongsTo(ProductsCategories, {foreignKey:'category_id'});
BranchesProducts.hasMany(OptionsGroups, {foreignKey:'branches_product_id'});

//OptionsGroups relations
OptionsGroups.hasMany(Options, {foreignKey:'option_group_id'});
OptionsGroups.hasOne(OptionsGroups, {foreignKey:'max_select_restrained_by', as:'maxSelectionRestriction'});

//BranchesProductsOptionsGroups relations
//BranchesProductsOptionsGroups.belongsToMany(OrdersProducts, {through:{model:OrdersOptionsGroups, unique:false}, foreignKey:'options_group_id', otherKey:'orders_product_id'});  //order

//Options relations
Options.belongsTo(OptionsGroups, {foreignKey:'option_group_id'});
Options.belongsTo(Items, {foreignKey:'item_id'});
//Options.belongsToMany(OrdersOptionsGroups, {through:{model:OrdersOptions, unique:false}, foreignKey:'option_id', otherKey:'orders_options_group_id'});  //order

//Orders relations
/* Orders.belongsToMany(BranchesProducts, {through: {model: OrdersProducts, unique:false}, foreignKey:'order_id', otherKey:'product_id', as:'products'}); //order
OrdersProducts.belongsToMany(BranchesProductsOptionsGroups, {through:{model:OrdersOptionsGroups, unique:false}, foreignKey:'orders_product_id', otherKey:'options_group_id', as:'ordersGroups'});  //order
Orders.belongsTo(PaymentMethods, {foreignKey:'payment_method_id'});  //order */

//Items //relations
Items.hasMany(Options, {foreignKey:'item_id'});