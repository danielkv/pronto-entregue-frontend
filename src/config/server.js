const serverConfig = {};

/* serverConfig.host = 'https://api.prontoentregue.com.br/graphql';
serverConfig.webSocket = 'wss://api.prontoentregue.com.br/graphql'; */

if (process.env.NODE_ENV === 'production') {
	serverConfig.host = process.env.SERVER_HOST;
	serverConfig.webSocket = process.env.SERVER_WEBSOCKET;
} else {
	serverConfig.host = 'http://localhost:4000/graphql';
	serverConfig.webSocket = 'ws://localhost:4000/graphql';
}

export default serverConfig;