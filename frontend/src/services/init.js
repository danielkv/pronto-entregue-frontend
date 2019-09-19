import client from './server';
import {AUTHENTICATION} from '../graphql/authentication';
import {SELECT_COMPANY, GET_USER_COMPANIES, GET_SELECTED_COMPANY} from '../graphql/companies';

function authenticate () {
	const token = localStorage.getItem('@flakery/userToken');
	
	client.writeData({data:{userToken:token}});

	return client.query({query:AUTHENTICATION})
	.then(({data})=>{
		if (data.me) {
			client.writeData({data:{isUserLoggedIn:true}});
			return true;
		}
		return false;
	});
}

function loadInitialData() {
	return client.query({query:GET_USER_COMPANIES})
	.then (async ({data})=> {
		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});
		const selectCompany_id = selectedCompany || data.userCompanies[0].id;

		return client.mutate({mutation:SELECT_COMPANY, variables:{id:selectCompany_id}});
	});
}

export function init() {
	
	//Verifica se usuário já foi autenticado
	return authenticate()
	.then(result => {
		if (!result) throw new Error('Usuário não foi autenticado');
		if (window.location.pathname === '/login') return window.location.href = '/';

		//Load inital data
		return loadInitialData();
	})
	.catch ((err)=>{
		console.error(err);
		//Usuário não está autenticado ou ocorreu algum erro
		if (window.location.pathname !== '/login') return window.location.href = '/login';
	});
}