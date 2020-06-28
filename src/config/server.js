const serverConfig = {};

/* serverConfig.host = 'https://api.prontoentregue.com.br/graphql';
serverConfig.webSocket = 'wss://api.prontoentregue.com.br/graphql'; */

if (process.env.NODE_ENV === 'production') {
	serverConfig.host = 'https://api.prontoentregue.com.br/graphql';
	serverConfig.webSocket = 'wss://api.prontoentregue.com.br/graphql';

	serverConfig.host = 'https://staging.prontoentregue.com.br/graphql';
	serverConfig.webSocket = 'wss://staging.prontoentregue.com.br/graphql';
} else {
	serverConfig.host = 'http://localhost:4000/graphql';
	serverConfig.webSocket = 'ws://localhost:4000/graphql';
}

export default serverConfig;