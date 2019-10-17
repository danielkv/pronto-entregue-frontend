const {gql} = require('apollo-server');
const {Op, col, where,  literal, fn, and, escape:Escape} = require('sequelize');
const {ZipcodeError} = require('../utilities/errors');

module.exports.typeDefs = gql`
	type DeliveryArea {
		id:ID!
		name:String!
		type:String!
		price:Float!
		zipcode_a:Int!
		zipcode_b:Int
		createdAt:String!
		updatedAt:String!
	}

	input DeliveryAreaInput {
		name:String
		type:String
		price:Float
		zipcode_a:Int
		zipcode_b:Int
	}

	extend type Query {
		calculateDeliveryPrice(zipcode:Int!): DeliveryArea!
	}

	extend type Mutation {
		createDeliveryArea(data:DeliveryAreaInput!):DeliveryArea!
		updateDeliveryArea(id:ID!, data:DeliveryAreaInput!):DeliveryArea!
		removeDeliveryArea(id:ID!):DeliveryArea!
	}
`;

module.exports.resolvers = {
	Query: {
		calculateDeliveryPrice: (parent, {zipcode}, ctx) => {
			return ctx.branch.getDeliveryAreas({
				order:[['price', 'DESC']],
				limit: 1,
				where: {
					[Op.or] : [
						{type: 'single', zipcode_a: zipcode},
						{type: 'set', zipcode_a: {[Op.lte]: zipcode}, zipcode_b: {[Op.gte]: zipcode}},
						{type: 'joker', zipcode_a: fn('substring', zipcode, 1, fn('char_length', col('zipcode_a')))},
					]
				}
			})
			.then(([area])=>{
				if (!area) throw new ZipcodeError('Não há entregas para esse local');

				return area;
			})
		},
	},
	Mutation : {
		createDeliveryArea: (parent, {data}, ctx) => {
			return ctx.branch.createDeliveryArea(data);
		},
		updateDeliveryArea: (parent, {id, data}, ctx) => {
			return ctx.branch.getDeliveryAreas({where:{id}})
			.then (([delivery_area]) => {
				if (!delivery_area) throw new Error('Área de entrega não encontrada');

				return delivery_area.update(data, {fields:['name', 'type', 'zipcodes', 'price']});
			});
		},
		removeDeliveryArea: (parent, {id}, ctx) => {
			return ctx.branch.getDeliveryAreas({where:{id}})
			.then (([delivery_area]) => {
				if (!delivery_area) throw new Error('Área de entrega não encontrada');

				return delivery_area.destroy();
			});
		},
	}
}