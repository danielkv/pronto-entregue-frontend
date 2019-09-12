const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type OptionsGroup {
		id:ID!
		name:String!
		type:String!
		min_select:Int!
		max_select:Int!
		active:Boolean!
		createdAt:String!
		updatedAt:String!
		options:[Option]!
		max_select_restricted_by:OptionsGroup
	}
`;

module.exports.resolvers = {
	OptionsGroup: {
		options: (parent, args, ctx) => {
			return parent.getOptions();
		},
		max_select_restricted_by: (parent, args, ctx) => {

		},
	}
}