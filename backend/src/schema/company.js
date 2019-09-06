const Companies = require('../model/companies');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type CompanyMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type Company {
		id:ID!
		name:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		metas:[CompanyMeta]!
		branches:[Branch]!
	}
`;

module.exports.resolvers = {
	Query : {
		companies: (parent, args, ctx) => {
			return Companies.findAll();
		}
	},
	Company: {
		branches: (parent, args, ctx) => {
			return parent.getBranches();
		},
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
	}
}