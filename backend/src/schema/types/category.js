const {gql} = require('apollo-server');

module.exports = gql`
	type category {
		id:ID!
		name:String!
		permissions:String!
		active:Boolean!
		order:Integer!
		created_at:String!
		updated_at:String!
	}

	type Query {
		categories:[category]!
		category(id:ID!): category!
	}
`;