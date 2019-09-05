const {gql} = require('apollo-server');

module.exports = gql`
	type shipping_area {
		id:ID!
		name:String!
		type:String!
		email:String!
		amount:Float!
		zipcodes:Boolean!
		created_at:String!
		updated_at:String!
	}

	type Query {
		shipping_areas:[shipping_area]!
		shipping_area(id:ID!): shipping_area!
	}
`;