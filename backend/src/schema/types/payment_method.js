const {gql} = require('apollo-server');

module.exports = gql`
	type payment_method {
		id:ID!
		name:String!
		display_name:String!
		created_at:String!
		updated_at:String!
	}

	type Query {
		payment_methods:[payment_method]!
		payment_method(id:ID!): payment_method!
	}
`;