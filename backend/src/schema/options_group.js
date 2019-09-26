const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OptionsGroup {
		id:ID!
		name:String!
		type:String!
		order:Int!
		min_select:Int!
		max_select:Int!
		active:Boolean!
		createdAt:String!
		updatedAt:String!
		options:[Option]!
		max_select_restrained_by:OptionsGroup
	}
`;

module.exports.resolvers = {
	OptionsGroup: {
		options: (parent, args, ctx) => {
			return parent.getOptions();
		},
		max_select_restrained_by: (parent, args, ctx) => {
			return parent.getMaxSelectionRestriction();
		},
	}
}