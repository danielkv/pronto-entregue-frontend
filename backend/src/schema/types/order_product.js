const {gql} = require('apollo-server');

module.exports = gql`
	type order_product {
		id:ID!
		name:String!
		amount:Float!
		message:Integer!
		created_at:String!
		updated_at:String!
		#order_options_groups
	}

	type Query {
		order_products(order_id:ID!):[order_product]!
		order_product(id:ID!): order_product!
	}
`;