import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const GRAPHQL_ENDPOINT = process.env.NODE_ENV === 'production' ? 'ws://ec2-18-228-44-149.sa-east-1.compute.amazonaws.com/graphql' : `ws://localhost:4000/graphql`;

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
	reconnect: true,
	//reconnectionAttempts: 5,
	timeout: 20000,
});

export default new WebSocketLink(client);