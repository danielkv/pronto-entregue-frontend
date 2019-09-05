const {gql} = require('apollo-server');

module.exports = gql`
	type order_options_group {
		id:ID!
		name:String!
		type:String!
		created_at:String!
		updated_at:String!
		#order_options
	}

	type Query {
		order_options_groups(order_product_id:ID!):[order_options_group]!
		order_options_group(id:ID!): order_options_group!
	}
`;