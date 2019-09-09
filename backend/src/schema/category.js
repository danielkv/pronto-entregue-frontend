const ProductsCagetories = require('../model/products_categories')
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Category {
		id:ID!
		name:String!
		permissions:String!
		active:Boolean!
		order:Int!
		created_at:String!
		updated_at:String!
		products:[Product]!
	}

	extend type Query {
		category(id:ID!): Category!
	}
`;

module.exports.resolvers = {
	Query : {
		category: (parent, {id}, ctx) => {
			return ProductsCagetories.findByPk(id)
			.then(category => {
				if (!category) throw new Error('Categoria não encontrada');
				return category;
			})
		},
	},
	Category : {
		products: (parent) => {
			return parent.getProducts();
		}
	}
}