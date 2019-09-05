const {gql} = require('apollo-server');

module.exports = gql`
	type company_meta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type company {
		id:ID!
		name:String!
		active:Boolean!
		metas:[company_meta]!
		created_at:String!
		updated_at:String!
		#branches
	}

	type Query {
		companies:[company]!
		company(id:ID!): company!
	}
`;