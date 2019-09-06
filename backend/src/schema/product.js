const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Product {
		id:ID!
		name:String!
		image:String!
		type:String!
		amount:Float!
		active:Boolean!
		created_at:String!
		updated_at:String!
		options_groups:[OptionsGroup]!
	}
`;

module.exports.resolvers = {
	Product: {
		options_groups: (parent, args, ctx) => {
			return parent.getOptionsGroups();
		},
	}
}