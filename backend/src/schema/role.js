const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Role {
		id:ID!
		name:String!
		display_name:String!
		permissions:[String]!
		createdAt:String!
		updatedAt:String!
	}
`;

module.exports.resolvers = {}