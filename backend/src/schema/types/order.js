const {gql} = require('apollo-server');

module.exports = gql`
	type order {
		id:ID!
		payment_fee:
		name:String!
		shipping_amount:Float!
		amount:Float!
		discount:Float!
		status:String!
		message:String!
		street:String!
		number:String!
		complement:String!
		city:String!
		state:String!
		district:String!
		zipcode:String!
		created_at:String!
		updated_at:String!
		#products
		#payment_method
	}

	type Query {
		orders(branch_id:ID!):[order_option]!
		order(id:ID!): order!
	}
`;