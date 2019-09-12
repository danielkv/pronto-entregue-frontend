const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type DeliveryArea {
		id:ID!
		name:String!
		type:String!
		price:Float!
		zipcodes:String!
		createdAt:String!
		updatedAt:String!
	}

	input DeliveryAreaInput {
		name:String
		type:String
		price:Float
		zipcodes:String
	}

	extend type Mutation {
		addDeliveryArea(data:DeliveryAreaInput!):DeliveryArea!
		updateDeliveryArea(id:ID!, data:DeliveryAreaInput!):DeliveryArea!
		removeDeliveryArea(id:ID!):DeliveryArea!
	}
`;

module.exports.resolvers = {
	Mutation : {
		addDeliveryArea: (parent, {data}, ctx) => {
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