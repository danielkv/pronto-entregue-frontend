const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OrderOption {
		id:ID!
		name:String!
		amount:Float!
		created_at:String!
		updated_at:String!
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