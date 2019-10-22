const sequelize = require('../services/connection');
const Sequelize = require('sequelize');
const Branches = require('../model/branches');
const Products = require('../model/products');
const OrdersProducts = require('../model/orders_products');
const ProductsCategories = require('../model/products_categories');
const BranchesMeta = require('../model/branches_meta');
const PaymentMethods = require('../model/payment_methods');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type BranchMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		createdAt:String!
	}

	type BusinessTime {
		from:String
		to:String
	}


	type BusinessHour {
		day_of_week:String!
		hours:[BusinessTime]!
	}

	input BusinessTimeInput {
		from:String
		to:String
	}
	
	input BusinessHourInput {
		day_of_week:String!
		hours:[BusinessTimeInput!]!
	}

	type ProductBestSeller {
		id:ID!
		name:String!
		image:String!
		qty:Int!
	}

	type Branch {
		id:ID!
		name:String!
		active:Boolean!
		createdAt:String! @dateTime
		updatedAt:String! @dateTime
		company:Company!
		metas:[BranchMeta]!
		business_hours:[BusinessHour]!
		orders (limit:Int, filter:Filter):[Order]!
		user_relation:BranchRelation!
		last_month_revenue:Float!

		paymentMethods:[PaymentMethod]!
		deliveryAreas:[DeliveryArea]!
		users(filter:Filter):[User]!
		categories(filter:Filter):[Category]!
		products(filter:Filter):[Product]!

		orders_qty(filter:Filter):Int!
		best_sellers (limit:Int!, createdAt:String): [ProductBestSeller]!
	}

	input BranchMetaInput {
		id:ID
		action:String! #create | update | delete
		meta_type:String
		meta_value:String
	}
	
	input BranchInput {
		name:String
		active:Boolean
		metas:[BranchMetaInput]
	}

	extend type Query {
		branch(id:ID!): Branch!
	}

	extend type Mutation {
		createBranch(data:BranchInput!):Branch! @hasRole(permission:"branches_edit", scope:"adm")
		updateBranch(id:ID!, data:BranchInput!): Branch! @hasRole(permission:"branches_edit", scope:"adm")

		enablePaymentMethod(id:ID!):Branch! @hasRole(permission:"payment_methods_edit", scope:"adm")
		disablePaymentMethod(id:ID!):Branch! @hasRole(permission:"payment_methods_edit", scope:"adm")

		updateBusinessHours(data:[BusinessHourInput]!):[BusinessHour]! @hasRole(permission:"branches_edit", scope:"adm")
	}
`;

module.exports.resolvers = {
	Query : {
		branch: (parent, {id}, ctx) => {
			return Branches.findByPk(id)
			.then(branch => {
				if (!branch) throw new Error('Filial não encontrada');
				return branch;
			})
		}
	},
	Mutation:{
		updateBusinessHours: (parent, {data}, ctx) => {
			return ctx.branch.getMetas({where:{meta_type:'business_hours'}})
			.then(async ([business_hours])=>{
				const meta_value = JSON.stringify(data);
				if (!business_hours) {
					//create
					await ctx.branch.createMeta({meta_type: 'business_hours', meta_value});
				} else {
					//update
					await business_hours.update({meta_value});
				
				}
				return data;
			})
		},
		createBranch: (parent, {data}, ctx) => {
			return sequelize.transaction(transaction => {
				return Branches.create(data, {include:[BranchesMeta], transaction})
				.then(branch => {
					return ctx.company.addBranch(branch, {transaction});
				});
			})
		},
		updateBranch: (parent, {id, data}, ctx) => {
			return sequelize.transaction(transaction => {
				return ctx.company.getBranches({where:{id}})
				.then(([branch])=>{
					if (!branch) throw new Error('Filial não encontrada');

					return branch.update(data, { fields: ['name', 'active'], transaction });
				})
				.then(async (branch_updated) => {
					if (data.metas) {
						await BranchesMeta.updateAll(data.metas, branch_updated, transaction);
					}
					return branch_updated;
				})
			})
		},
		enablePaymentMethod : (parent, {id}, ctx) => {
			return PaymentMethods.findByPk(id)
			.then (async (payment_method) => {
				if (!payment_method) throw new Error('Método de pagamento não encontrado');

				const [method] = await ctx.branch.addPaymentMethods(payment_method);
				
				return ctx.branch;
			})
		},
		disablePaymentMethod : (parent, {id}, ctx) => {
			return PaymentMethods.findByPk(id)
			.then (async (payment_method) => {
				if (!payment_method) throw new Error('Método de pagamento não encontrado');

				const method = await ctx.branch.removePaymentMethod(payment_method);

				return ctx.branch;
			})
		},
		
	},
	Branch: {
		users: (parent, {filter}, ctx) => {
			let where = {active: true};
			if (filter && filter.showInactive) delete where.active;

			return parent.getUsers({where});
		},
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
		categories: (parent, {filter}, ctx) => {
			let where = {active: true};
			if (filter && filter.showInactive) delete where.active;

			return parent.getCategories({where});
		},
		products : (parent, {filter}) => {
			let where = {active: true};
			if (filter && filter.showInactive) delete where.active;

			return Products.findAll({where, include:[{model:ProductsCategories, where:{branch_id:parent.get('id')}}]})
		},
		paymentMethods: (parent, args, ctx) => {
			return parent.getPaymentMethods();
		},
		deliveryAreas: (parent, args, ctx) => {
			return parent.getDeliveryAreas();
		},
		business_hours: (parent, args, ctx) => {
			return parent.getMetas({where:{meta_type:'business_hours'}})
			.then(([business_hours])=>{
				if (!business_hours) {
					return [
						{
							day_of_week:'Domingo',
							hours:[{from:'', to:''}]
						},
						{
							day_of_week:'Segunda-Feira',
							hours:[{from:'', to:''}]
						},
						{
							day_of_week:'Terça-Feira',
							hours:[{from:'', to:''}]
						},
						{
							day_of_week:'Quarta-Feira',
							hours:[{from:'', to:''}]
						},
						{
							day_of_week:'Quinta-Feira',
							hours:[{from:'', to:''}]
						},
						{
							day_of_week:'Sexta-Feira',
							hours:[{from:'', to:''}]
						},
						{
							day_of_week:'Sábado',
							hours:[{from:'', to:''}]
						},
					]
				} else {
					return JSON.parse(business_hours.meta_value);
				}
			})
		},
		orders_qty: (parent, {filter}) => {
			let where = filter;

			if (filter.createdAt) {
				const createdAt = filter.createdAt;
				delete filter.createdAt;
				where = {
					[Sequelize.Op.and] : [
						filter,
						Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), Sequelize.fn(createdAt)),
					]
				}
			}
			return parent.getOrders({where})
			.then((orders)=>{
				return orders.length;
			})
		},
		orders: (parent, {limit, filter}, ctx) => {
			let where = filter;

			if (filter && filter.createdAt) {
				const createdAt = filter.createdAt;
				delete filter.createdAt;
				where = {
					[Sequelize.Op.and] : [
						filter,
						Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), Sequelize.fn(createdAt)),
					]
				}
			}

			return parent.getOrders({where, limit, order:[['createdAt', 'DESC']]});
		},
		user_relation: (parent, args, ctx) => {
			if (!parent.branch_relation) throw new Error('Nenhum usuário selecionado');
			return parent.branch_relation.getRole()
			.then(role => {
				return {
					...parent.branch_relation.get(),
					role,
				}
			});
		},
		last_month_revenue : (parent, args, ctx) => {
			return 0;
		},
		best_sellers: (parent, {limit, createdAt}) => {
			let where = {};

			if (createdAt) {
				where = Sequelize.where(Sequelize.fn('date', Sequelize.col('OrdersProducts.created_at')), Sequelize.fn(createdAt));
			}

			return OrdersProducts.findAll({
				attributes:[
					[Sequelize.col('product_id'), 'id'],
					[Sequelize.col('productRelated.name'), 'name'],
					[Sequelize.col('productRelated.image'), 'image'],
					[Sequelize.fn('COUNT', Sequelize.col('product_id')), 'qty']
				],
				group: ['product_id'],
				order: [[Sequelize.fn('COUNT', Sequelize.col('product_id')), 'DESC'], [Sequelize.col('name'), 'ASC']],

				limit,
				where,

				include:[{
					model: Products,
					as:'productRelated'
				}]
			})
			.then (products=> {
				return products.map(row=>row.get());
			})
		}
	}
}