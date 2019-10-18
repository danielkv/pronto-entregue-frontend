const sequelize = require('../services/connection');
const Branches = require('../model/branches');
const Products = require('../model/products');
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

	type BusinessHour {
		day_of_week:String!
		hours:String!
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
		orders:[Order]!
		user_relation:BranchRelation!
		last_month_revenue:Float!

		paymentMethods:[PaymentMethod]!
		deliveryAreas:[DeliveryArea]!
		users(filter:Filter):[User]!
		categories(filter:Filter):[Category]!
		products(filter:Filter):[Product]!
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
		},
	},
	Mutation:{
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

		},
		orders: (parent, args, ctx) => {
			return parent.getOrders({order:[['createdAt', 'DESC']]});
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
		}
	}
}