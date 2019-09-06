const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const Roles = require('../model/roles');
const Companies = require('../model/companies');
const {salt} = require('../utilities');
//const Notifications = require('../notifications');
//const sequelize = require('../services/connection');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type UserMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type BranchRelation {
		active:Boolean!
		role: Role!
	}

	type User {
		id:ID!
		first_name:String!
		last_name:String!
		email:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		metas:[UserMeta]!
		companies:[Company]!
		branches:[Branch]!
		branch_relation:BranchRelation!
	}
`;

module.exports.resolvers = {
	Query : {
		users : (parent, args, ctx) => {
			return Users.findAll();
		}
	},
	User: {
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
		companies: (parent, args, ctx) => {
			return parent.getCompanies();
		},
		branches: (parent, args, ctx) => {
			return parent.getBranches();
		},
		branch_relation: (parent, args, ctx) => {
			if (!parent.branches_users) throw new Error('Nenhum usuário selecionado');
			return parent.branches_users.getRole()
			.then(role => {
				return {
					role,
					active:parent.branches_users.active
				}
			})
		},
	}
}