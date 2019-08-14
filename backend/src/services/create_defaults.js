const Roles = require('../model/roles');
const PaymentMethods = require('../model/payment_methods');

Roles.bulkCreate([
	{
		name: 'master',
		display_name: 'Master',
		permissions: '["master","adm","companies_read","companies_edit","branches_read","branches_edit","products_read","products_edit","options_read","options_edit","orders_read","orders_edit","shipping_areas_read","shipping_areas_edit","users_read","users_edit","payment_methods_read","payment_methods_edit","roles_read","roles_edit","customer"]'
	},
	{
		name: 'adm',
		display_name: 'Administração',
		permissions: '["companies_edit","branches_read","branches_edit","products_read","products_edit","options_read","options_edit","orders_read","orders_edit","shipping_areas_read","shipping_areas_edit","users_read","users_edit","payment_methods_read","payment_methods_edit","roles_read","roles_edit","customer"]'
	},
	{
		name: 'branches_manager',
		display_name: 'Gerente de Filial',
		permissions: '["branches_read","branches_edit","products_read","products_edit","options_read","options_edit","orders_read","orders_edit","shipping_areas_read","shipping_areas_edit","users_read","users_edit","payment_methods_read","payment_methods_edit","roles_read","roles_edit","customer"]'
	},
	{
		name: 'manager',
		display_name: 'Gerente',
		permissions: '["branches_read","products_read","products_edit","options_read","options_edit","orders_read","orders_edit","shipping_areas_read","shipping_areas_edit","users_read","users_edit","payment_methods_read","payment_methods_edit","roles_read","roles_edit","customer"]'
	},
	{
		name: 'seller',
		display_name: 'Vendedor',
		permissions: '["branches_read","products_read","options_read","options_edit","orders_read","orders_edit","shipping_areas_read","users_read","payment_methods_read","customer"]'
	},
	{
		name: 'customer',
		display_name: 'Cliente',
		permissions: '["customer"]'
	},
]);

PaymentMethods.bulkCreate([
	{
		name: 'credit_debit',
		display_name: 'Cartão de Crédito/Débito',
	},
	{
		name: 'money',
		display_name: 'Dinheiro',
	},
]);