import { GET_ORDERS_ROLL } from "../graphql/ordersRoll"

export default {
	Mutation: {
		addOrderRoll(_, { order }, { cache }) {
			const { ordersRoll } = cache.readQuery({ query: GET_ORDERS_ROLL });

			const newOrdersRoll = [order, ...ordersRoll];

			cache.writeQuery({ query: GET_ORDERS_ROLL, data: { ordersRoll: newOrdersRoll } })
		},
		resetOrdersRoll(_, __, { cache }) {
			cache.writeData({ ordersRoll: [] });
		}
	}
}