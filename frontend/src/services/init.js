import client from './server';
import {AUTHENTICATION, LOAD_INITIAL_DATA} from './graphql';

async function isUserLoggedIn () {
	const token = localStorage.getItem('@flakery/userToken');
	let response = null;

	if (token) {
		client.writeData({data:{userToken:token}});
		response = await client.query({query:AUTHENTICATION});
	}

	if (response.data.me) return true;
	return false;
}

async function loadInitialData() {
	const {data} = await client.query({query:LOAD_INITIAL_DATA});

	console.log(data);
}

async function init() {
	try {
		//Verifica se usuário já foi autenticado
		if (await isUserLoggedIn()) {
			//Redireciona para Dashboard se usuário acessou página de login
			if (window.location.pathname === '/login') return window.location.href = '/';

			//Load inital data
			loadInitialData();
		}
	} catch (err) {
		//Usuário não está autenticado ou ocorreu algum erro
		if (window.location.pathname !== '/login') return window.location.href = '/login';
	}
}

init();



