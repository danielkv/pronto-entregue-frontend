const {gql} = require('apollo-server');

module.exports = gql`
	type product {
		id:ID!
		name:String!
		image:String!
		type:String!
		amount:Float!
		active:Boolean!
		created_at:String!
		updated_at:String!
		#options_groups
	}

	type Query {
		products:[product]!
		product(id:ID!): product!
	}
`;