const {gql} = require('apollo-server');

module.exports = gql`
	type role {
		id:ID!
		name:String!
		display_name:String!
		permissions:String!
		created_at:String!
		updated_at:String!
	}

	type Query {
		roles:[role]!
		role(id:ID!): role!
	}
`;