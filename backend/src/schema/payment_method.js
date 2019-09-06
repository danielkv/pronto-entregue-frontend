const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type PaymentMethod {
		id:ID!
		name:String!
		display_name:String!
		created_at:String!
		updated_at:String!
	}
`;

module.exports.resolvers = {}