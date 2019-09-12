import client from './server';
import {AUTHENTICATION} from '../graphql/authentication';
import {LOAD_INITIAL_DATA} from '../graphql/user';
import {SELECT_COMPANY} from '../graphql/companies';

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
	
	client.writeData({data:{userCompanies: data.me.companies}});
	
	await client.mutate({mutation:SELECT_COMPANY, variables:{id:data.me.companies[0].id}});
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



