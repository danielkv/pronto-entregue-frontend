const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Order {
		id:ID!
		payment_fee:Float!
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
		products:[Product]!
		payment_method:PaymentMethod!
	}
`;

module.exports.resolvers = {
	Order: {
		products: (parent, args, ctx) => {
			return parent.getOrderProducts();
		},
		payment_method: (parent, args, ctx) => {
			return parent.getPaymentMethod();
		},
	}
}