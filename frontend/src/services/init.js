import client from './server';
import {AUTHENTICATION} from '../graphql/authentication';
import {SELECT_COMPANY, GET_USER_COMPANIES} from '../graphql/companies';

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

function loadInitialData() {
	client.query({query:GET_USER_COMPANIES})
	.then (async ({data})=> {
		await client.mutate({mutation:SELECT_COMPANY, variables:{id:data.userCompanies[0].id}});
	});
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
		console.error(err);
		//Usuário não está autenticado ou ocorreu algum erro
		if (window.location.pathname !== '/login') return window.location.href = '/login';
	}
}

init();