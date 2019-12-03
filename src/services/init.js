import {useState, useEffect} from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";

import client from './server';

import { IS_USER_LOGGED_IN, IS_USER_AUTHENTICATED, AUTHENTICATE, LOGGED_USER_ID } from '../graphql/authentication';
import { SELECT_COMPANY, GET_USER_COMPANIES, GET_SELECTED_COMPANY } from '../graphql/companies';


export function useInitialize() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { data: initializedData } = useQuery(gql`{initialized @client}`);
	const { data: userLoggedInData } = useQuery(IS_USER_LOGGED_IN);
	const { data: authenticatedData } = useQuery(IS_USER_AUTHENTICATED);

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
	try {
		const token = localStorage.getItem('@flakery/userToken');
		
		if (!token) return false;
		client.writeData({ data: { userToken: token } });
		
		const { data } = await client.mutate({ mutation: AUTHENTICATE, variables: { token } });
		logUserIn(data.authenticate, token);
		
		const initialData = await loadInitialData();
		if (!initialData) throw new Error('Não foi possível carregar os dados iniciais');

		return true;
	} catch (e) {
		logUserOut();
		throw e;
	};
}

export function logUserIn (user, token) {
	localStorage.setItem('@flakery/userToken', token);
	client.writeData({ data: { authenticated: true, isUserLoggedIn: true, userToken: token, loggedUserId: user.id } });	
}

export function logUserOut () {
	localStorage.removeItem('@flakery/userToken');
	localStorage.removeItem('@flakery/selectedCompany');
	localStorage.removeItem('@flakery/selectedBranch');
	client.writeData({ data: { userToken: null, authenticated: false, isUserLoggedIn: false } });
	client.resetStore();
}

function loadInitialData() {
	const { loggedUserId } = client.readQuery({ query: LOGGED_USER_ID });
	return client.query({ query: GET_USER_COMPANIES, variables: { id: loggedUserId } })
		.then (async ({ data: { user: { companies = [] } = {} } = {} }) => {
			const { selectedCompany } = client.readQuery({ query: GET_SELECTED_COMPANY });
			const selectCompany_id = selectedCompany || companies[0].id;

			client.writeData({ data:  { initialized: true } });

			await client.mutate({ mutation: SELECT_COMPANY, variables: { id: selectCompany_id } });

			return true;
		});
}