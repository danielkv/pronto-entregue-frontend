const Branches = require('../model/branches');
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
		products:[Product]!
		orders:[Order]!
		user_relation:BranchRelation!
	}
`;

module.exports.resolvers = {
	Query : {
		branches : (parent, args, ctx) => {
			return Branches.findAll();
		}
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
		products: (parent, args, ctx) => {
			return parent.getProducts();
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