const Branches = require('../model/branches');
const BranchesMeta = require('../model/branches_meta');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type BranchMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type BusinessHour {
		day_of_week:String!
		hours:String!
	}

	type Branch {
		id:ID!
		name:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		company:Company!
		users:[User]!
		metas:[BranchMeta]!
		categories:[Category]!
		payment_methods:[PaymentMethod]!
		shipping_areas:[ShippingArea]!
		business_hours:[BusinessHour]!
		orders:[Order]!
		user_relation:BranchRelation!
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
					ctx.company.addbranch(branch);
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
		shipping_areas: (parent, args, ctx) => {
			return parent.getShippingAreas();
		},
		business_hours: (parent, args, ctx) => {

		},
		orders: (parent, args, ctx) => {
			return parent.getOrders();
		},
		user_relation: (parent, args, ctx) => {
			if (!parent.branches_users) throw new Error('Nenhum usuário selecionado');
			return parent.branches_users.getRole()
			.then(role => {
				return {
					role,
					active:parent.branches_users.active
				}
			});
		},
	}
}