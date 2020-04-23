import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const GRAPHQL_ENDPOINT = process.env.NODE_ENV === 'production' ? 'wss://pronto-entregue-backend.herokuapp.com/graphql' : `ws://localhost:4000/graphql`;

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
	reconnect: true,
	reconnectionAttempts: 5,
	timeout: 40000
});

export default new WebSocketLink(client);