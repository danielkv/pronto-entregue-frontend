const {gql} = require('apollo-server');

module.exports = gql`
	type options_group {
		id:ID!
		name:String!
		type:String!
		min_select:Integer!
		max_select:Integer!
		active:Boolean!
		created_at:String!
		updated_at:String!
		#options
		#max_select_restricted_by
	}

	type Query {
		order_options_groups(order_product_id:ID!):[order_options_group]!
		order_options_group(id:ID!): order_options_group!
	}
`;