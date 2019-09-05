const {gql} = require('apollo-server');

module.exports = gql`
	type user_meta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type user {
		id:ID!
		first_name:String!
		last_name:String!
		email:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		metas:[user_meta]!
		#companies
		#branches
			#role
	}

	type Query {
		users:[user]!
		user(id:ID!): user!
	}
`;