import {useState, useEffect} from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";

import client from './server';

import {LOGGED_USER, IS_USER_LOGGED_IN, IS_USER_AUTHENTICATED} from '../graphql/authentication';
import {SELECT_COMPANY, GET_USER_COMPANIES, GET_SELECTED_COMPANY} from '../graphql/companies';


export function useInitialize() {

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const {data:initializedData} = useQuery(gql`{initialized @client}`);
	const {data:userLoggedInData} = useQuery(IS_USER_LOGGED_IN);
	const {data:authenticatedData} = useQuery(IS_USER_AUTHENTICATED);

	const isUserLoggedIn = userLoggedInData.isUserLoggedIn;
	const initialized = initializedData.initialized;
	const authenticated = authenticatedData.authenticated;

	useEffect(()=>{
		if (!isUserLoggedIn || !initialized) setLoading(true);
	}, [isUserLoggedIn, initialized])

	if (!authenticated || !initialized) {
		init()
		.then(()=>{
			setLoading(false);
		})
		.catch((err)=>{
			setError(err);
		})
	}
	
	return {
		error,
		loading,
		authenticated,
		initialized
	}
}

async function init() {
	/* try { */
		
		const token = localStorage.getItem('@flakery/userToken');
		
		if (!token) return false;
		client.writeData({data:{userToken:token}});
		
		const authentication = await authenticate(token);
		if (!authentication) throw new Error('Não foi possível autenticar usuário');
		
		const initialData = await loadInitialData();
		if (!initialData) throw new Error('Não foi possível carregar os dados iniciais');

		return true;
	/* } catch (e) {
		logUserOut();
		throw e;
	}; */
}

export function logUserIn (token) {
	localStorage.setItem('@flakery/userToken', token);
	client.writeData({data:{userToken:token}});
	client.writeData({data:{isUserLoggedIn:true}});
}

export function logUserOut () {
	client.writeData({data:{isUserLoggedIn:false}});
	client.writeData({data:{initialized:false}});
	client.writeData({data:{authenticated:false}});
	localStorage.removeItem('@flakery/userToken');
	localStorage.removeItem('@flakery/selectedCompany');
	localStorage.removeItem('@flakery/selectedBranch');
}


async function authenticate () {
	const {data:userData} = await client.query({query:LOGGED_USER});
	
	if (!userData.me) return false;

	client.writeData({data:{isUserLoggedIn:true}});
	client.writeData({data:{authenticated:true}});
	return true;
}

function loadInitialData() {
	return client.query({query:GET_USER_COMPANIES})
	.then (async ({data})=> {
		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});
		const selectCompany_id = selectedCompany || data.userCompanies[0].id;

		client.writeData({data:{initialized:true}});

		await client.mutate({mutation:SELECT_COMPANY, variables:{id:selectCompany_id}});

		return true;
	});
}