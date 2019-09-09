const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type ShippingArea {
		id:ID!
		name:String!
		type:String!
		price:Float!
		zipcodes:String!
		created_at:String!
		updated_at:String!
	}

	input ShippingAreaInput {
		name:String
		type:String
		price:Float
		zipcodes:String
	}

	extend type Mutation {
		addShippingArea(data:ShippingAreaInput!):ShippingArea!
		updateShippingArea(id:ID!, data:ShippingAreaInput!):ShippingArea!
		removeShippingArea(id:ID!):ShippingArea!
	}
`;

module.exports.resolvers = {
	Mutation : {
		addShippingArea: (parent, {data}, ctx) => {
			return ctx.branch.createShippingArea(data);
		},
		updateShippingArea: (parent, {id, data}, ctx) => {
			return ctx.branch.getShippingAreas({where:{id}})
			.then (([shipping_area]) => {
				if (!shipping_area) throw new Error('Área de entrega não encontrada');

				return shipping_area.update(data, {fields:['name', 'type', 'zipcodes', 'price']});
			});
		},
		removeShippingArea: (parent, {id}, ctx) => {
			return ctx.branch.getShippingAreas({where:{id}})
			.then (([shipping_area]) => {
				if (!shipping_area) throw new Error('Área de entrega não encontrada');

				return shipping_area.destroy();
			});
		},
	}
}