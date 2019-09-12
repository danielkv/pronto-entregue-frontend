const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type PaymentMethod {
		id:ID!
		name:String!
		display_name:String!
		createdAt:String!
		updatedAt:String!
	}
`;

module.exports.resolvers = {}