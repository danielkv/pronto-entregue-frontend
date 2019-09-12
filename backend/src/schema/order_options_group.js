const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OrderOptionsGroup {
		id:ID!
		name:String!
		type:String!
		createdAt:String!
		updatedAt:String!
		order_options:[OrderOption]!
	}
`;

module.exports.resolvers = {
	OrderOptionsGroup: {
		order_options: (parent, args, ctx) => {
			return parent.getOrderOptions();
		},
	}
}