import React, { useReducer } from 'react';

export const OrderRollContext = React.createContext(null);

function reducer(state, action) {
	switch (action.type){
		case 'ADD_ORDER_ROLL': {
			return [action.order, ...state];
		}
		case 'RESER_ORDER_ROLL':
			return []
	}
}

export function OrdersRollContextProvider({ children }) {
	const [ordersRoll, dispatch] = useReducer(reducer, []);

	return (
		<OrderRollContext.Provider value={{ ordersRoll, dispatch }}>
			{children}
		</OrderRollContext.Provider>
	)
}