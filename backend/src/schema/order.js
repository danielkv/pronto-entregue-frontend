const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Order {
		id:ID!
		payment_fee:Float!
		name:String!
		delivery_price:Float!
		price:Float!
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
		createdAt:String!
		updatedAt:String!
		products:[Product]!
		payment_method:PaymentMethod!
	}

	input OrderProductInput {
		name:String
		action:String! #create | update | delete
		file:Upload
		type:String
		price:Float
		active:Boolean
		product_id:ID
		options_groups:[OrderOptionsGroupInput]
	}

	input OrderOptionsGroupInput {
		id:ID
		action:String! #create | update | delete
		name:String
		type:String
		min_select:Int
		max_select:Int
		active:Boolean
		options_group_id:ID
		options:[OrderOptionInput]
		max_select_restricted_by:ID
	}

	input OrderOptionInput {
		id:ID
		action:String! #create | update | delete
		name:String
		order:Int
		active:Boolean
		price:Float
		max_select_restrain_other:Int
		item_id:ID
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