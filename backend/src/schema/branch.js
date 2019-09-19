const sequelize = require('../services/connection');
const Branches = require('../model/branches');
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
		users:[User]!
		metas:[BranchMeta]!
		categories:[Category]!
		payment_methods:[PaymentMethod]!
		delivery_areas:[DeliveryArea]!
		business_hours:[BusinessHour]!
		orders:[Order]!
		user_relation:BranchRelation!
		last_month_revenue:Float!
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

		addPaymentMethod(id:ID!):Branch! @hasRole(permission:"payment_methods_edit", scope:"adm")
		removePaymentMethod(id:ID!):Branch! @hasRole(permission:"payment_methods_edit", scope:"adm")
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
		addPaymentMethod : (parent, {id}, ctx) => {
			return PaymentMethods.findByPk(id)
			.then (async (payment_method) => {
				if (!payment_method) throw new Error('Método de pagamento não encontrado');

				await ctx.branch.addPaymentMethods(payment_method);
				return ctx.branch;
			})
		},
		removePaymentMethod : (parent, {id}, ctx) => {
			return ctx.branch.getPaymentMethods({where:{id}})
			.then (async ([payment_method]) => {
				if (!payment_method) throw new Error('Método de pagamento não encontrado');

				await ctx.branch.removePaymentMethod(payment_method);
				return ctx.branch;
			})
		},
		
	},
	Branch: {
		users: (parent, args, ctx) => {
			return parent.getUsers();
		},
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
		categories: (parent, args, ctx) => {
			return parent.getCategories();
		},
		payment_methods: (parent, args, ctx) => {
			return parent.getPaymentMethods();
		},
		delivery_areas: (parent, args, ctx) => {
			return parent.getDeliveryAreas();
		},
		business_hours: (parent, args, ctx) => {

		},
		orders: (parent, args, ctx) => {
			return parent.getOrders();
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