const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OrderOption {
		id:ID!
		name:String!
		price:Float!
		createdAt:String!
		updatedAt:String!
		item:Item
	}
`;

module.exports.resolvers = {
	OrderOption: {
		item: (parent, args, ctx) => {
			return parent.getItems();
		},
	}
}