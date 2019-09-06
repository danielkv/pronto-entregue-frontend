const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OrderOptionsGroup {
		id:ID!
		name:String!
		type:String!
		created_at:String!
		updated_at:String!
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