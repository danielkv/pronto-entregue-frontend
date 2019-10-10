const {gql} = require('apollo-server');
const sequelize = require('../services/connection');
const OrderProducts = require('../model/orders_products');
const OrderOptionsGroups = require('../model/orders_options_groups');
const OrderOptions = require('../model/orders_options');

module.exports.typeDefs = gql`
	type Order {
		id:ID!
		user:User!
		payment_fee:Float!
		delivery_price:Float!
		price:Float!
		type:String!
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

	input OrderInput {
		user_id:ID!
		type:String!
		status:String!
		payment_method_id:ID

		payment_fee:Float!
		delivery_price:Float!
		discount:Float!
		price:Float!
		message:String!
		
		street:String!
		number:String!
		complement:String!
		city:String!
		state:String!
		district:String!
		zipcode:String!

		products:[OrderProductInput!]
	}

	input OrderProductInput {
		name:String!
		price:Float!
		message:String!
		product_id:ID
		optionsGroups:[OrderOptionsGroupInput!]
	}

	input OrderOptionsGroupInput {
		name:String!
		options_group_id:ID!
		
		options:[OrderOptionInput!]
	}

	input OrderOptionInput {
		name:String!
		price:Float!
		item_id:ID
		option_id:ID!
	}

	extend type Mutation {
		createOrder(data:OrderInput!):Order!
		updateOrder(data:OrderInput!):Order!
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
	},
	Mutation : {
		createOrder: (parent, {data}, ctx) => {
			return sequelize.transaction(transaction => {
				return ctx.branch.createOrder(data, {include:[{
					model: OrderProducts,
					as:'products',
					include:[{
						model: OrderOptionsGroups,
						as:'optionsGroups',
						include: [{
							model: OrderOptions,
							as: 'options',
						}]
					}]
				}], transaction})
			});
		}
	}
}