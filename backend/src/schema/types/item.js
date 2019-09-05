const {gql} = require('apollo-server');

module.exports = gql`
	type item {
		id:ID!
		name:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		#company_id
		#order_options
	}

	type Query {
		items(company_id:ID!):[item]!
		item(id:ID!): item!
	}
`;