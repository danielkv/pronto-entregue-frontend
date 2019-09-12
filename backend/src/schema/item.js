const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Item {
		id:ID!
		name:String!
		active:Boolean!
		createdAt:String!
		updatedAt:String!
		order_options:[OrderOption]!
	}
`;

module.exports.resolvers = {
	Item: {
		order_options: (parent, args, ctx) => {

		},
	}
}