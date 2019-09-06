const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Role {
		id:ID!
		name:String!
		display_name:String!
		permissions:[String]!
		created_at:String!
		updated_at:String!
	}
`;

module.exports.resolvers = {}