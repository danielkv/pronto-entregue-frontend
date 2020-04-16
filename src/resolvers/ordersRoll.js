import { sanitizeOrder } from "../utils/orders";

import { GET_ORDERS_ROLL } from "../graphql/ordersRoll"

export default {
	Mutation: {
		addOrderRoll(_, { order }, { cache }) {
			const { ordersRoll } = cache.readQuery({ query: GET_ORDERS_ROLL });

			ordersRoll.unshift(sanitizeOrder(order));

			cache.writeQuery({ query: GET_ORDERS_ROLL, data: { ordersRoll } })
		},
		resetOrdersRoll(_, __, { cache }) {
			cache.writeData({ ordersRoll: [] });
		}
	}
}