import { WebSocketLink } from 'apollo-link-ws';

const host = process.env.NODE_ENV === 'production' ? 'wss://pronto-entregue-backend.herokuapp.com/graphql' : `ws://localhost:4000/graphql`;

export default new WebSocketLink({
	uri: host,
	options: {
		reconnect: true
	}
});