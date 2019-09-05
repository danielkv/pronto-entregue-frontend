const {gql} = require('apollo-server');

module.exports = gql`
	type order_option {
		id:ID!
		name:String!
		amount:Float!
		created_at:String!
		updated_at:String!
		#item
	}

	type Query {
		order_options(order_options_group_id:ID!):[order_option]!
		order_option(id:ID!): order_option!
	}
`;