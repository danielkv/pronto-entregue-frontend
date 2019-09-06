const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type ShippingArea {
		id:ID!
		name:String!
		type:String!
		email:String!
		amount:Float!
		zipcodes:Boolean!
		created_at:String!
		updated_at:String!
	}
`;

module.exports.resolvers = {}