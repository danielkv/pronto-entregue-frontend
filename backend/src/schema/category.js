const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Category {
		id:ID!
		name:String!
		permissions:String!
		active:Boolean!
		order:Int!
		created_at:String!
		updated_at:String!
		products:[Product]!
	}
`;

module.exports.resolvers = {
	Category : {
		products: (parent) => {
			return parent.getProducts();
		}
	}
}