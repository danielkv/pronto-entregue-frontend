const Products = require('../model/products');
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

	extend type Query {
		product(id:ID!): Product!
	}
`;

module.exports.resolvers = {
	Query : {
		product: (parent, {id}, ctx) => {
			return Products.findByPk(id)
			.then(product => {
				if (!product) throw new Error('Produto não encontrada');
				return product;
			})
		},
	},
	Product: {
		options_groups: (parent, args, ctx) => {
			return parent.getOptionsGroups();
		},
	}
}