const {gql} = require('apollo-server');

module.exports = gql`
	type branch_meta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type branch {
		id:ID!
		name:String!
		active:Boolean!
		metas:[branch_meta]!
		created_at:String!
		updated_at:String!
		#company_id
		#users
		#categories
		#payment_methods
		#shipping_areas
		#business_hour
		#products
	}

	type Query {
		companies:[company]!
		company(id:ID!): company!
	}
`;