import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import serverConfig from '../../config/server';

const client = new SubscriptionClient(serverConfig.webSocket, {
	reconnect: true,
	//reconnectionAttempts: 5,
	timeout: 20000,
});

export default new WebSocketLink(client);