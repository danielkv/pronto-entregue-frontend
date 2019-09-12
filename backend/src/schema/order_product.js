const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OrderProduct {
		id:ID!
		name:String!
		price:Float!
		message:Int!
		createdAt:String!
		updatedAt:String!
		order_options_groups:[OrderOptionsGroup]
	}
`;

module.exports.resolvers = {
	OrderProduct: {
		order_options_groups: (parent, args, ctx) => {
			return parent.getOrderOptionsGroups();
		},
	}
}