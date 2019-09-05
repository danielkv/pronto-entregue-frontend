const {gql} = require('apollo-server');

module.exports = gql`
	type option {
		id:ID!
		name:String!
		order:Integer!
		active:Boolean!
		amount:Float!
		created_at:String!
		updated_at:String!
		#max_select_restrain_other
		#item
	}

	type Query {
		options(options_group_id:ID!):[option]!
		option(id:ID!): option!
	}
`;