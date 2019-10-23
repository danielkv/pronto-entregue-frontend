import {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";

import client from './server';

import {AUTHENTICATION, IS_USER_LOGGED_IN} from '../graphql/authentication';
import {SELECT_COMPANY, GET_USER_COMPANIES, GET_SELECTED_COMPANY} from '../graphql/companies';


export function useInitialize() {

	const [loading, setLoading] = useState(true);
	const {data:userLoggedInData} = useQuery(IS_USER_LOGGED_IN);
	const {data:initializedData} = useQuery(gql`{initialized @client}`);

	const isUserLoggedIn = userLoggedInData.isUserLoggedIn;
	const initialized = initializedData.initialized;

	if (!isUserLoggedIn || !initialized) {
		init()
		.then(()=>{
			setLoading(false);
		})
	}

	return {
		loading,
		isUserLoggedIn: userLoggedInData.isUserLoggedIn,
		initialized: initializedData.initialized
	}
}

async function init() {
	try {
		const token = localStorage.getItem('@flakery/userToken');
		if (!token) return false;
		client.writeData({data:{userToken:token}});
		
		const authentication = await authenticate(token);
		if (!authentication) return false;

		const initialData = await loadInitialData();
		if (!initialData) return false;
	} catch {
		logUserOut();
		return false;
	};
}

export function logUserIn (token) {
	client.writeData({data:{isUserLoggedIn:true}});
	localStorage.setItem('@flakery/userToken', token);
}

export function logUserOut () {
	client.writeData({data:{isUserLoggedIn:false}});
	client.writeData({data:{initialized:false}});
	localStorage.removeItem('@flakery/userToken');
	localStorage.removeItem('@flakery/selectedCompany');
	localStorage.removeItem('@flakery/selectedBranch');
}


async function authenticate () {
	const {data:userData} = await client.query({query:AUTHENTICATION});
	
	if (!userData.me) return false;

	client.writeData({data:{isUserLoggedIn:true}});
	return true;
}

function loadInitialData() {
	return client.query({query:GET_USER_COMPANIES})
	.then (async ({data})=> {
		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});
		const selectCompany_id = selectedCompany || data.userCompanies[0].id;

		client.writeData({data:{initialized:true}});

		return client.mutate({mutation:SELECT_COMPANY, variables:{id:selectCompany_id}});
	});
}