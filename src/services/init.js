import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


import client from './server';

import { IS_USER_LOGGED_IN, AUTHENTICATE, LOGGED_USER_ID } from '../graphql/authentication';
import { SET_SELECTED_COMPANY, GET_USER_COMPANIES, GET_SELECTED_COMPANY } from '../graphql/companies';


export function useInitialize() {
	//const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [called, setCalled] = useState(false);
	
	const { data: { loadingInit: loading } } = useQuery(gql`{loadingInit @client}`);
	const { data: initializedData } = useQuery(gql`{initialized @client}`);
	const { data: userLoggedInData } = useQuery(IS_USER_LOGGED_IN);

	const isUserLoggedIn = userLoggedInData.isUserLoggedIn;
	const initialized = initializedData.initialized;

	useEffect(()=>{
		if (loading) setCalled(false);
	}, [loading])

	if (!called) {
		setCalled(true);
		init()
			.finally(()=>{
				setTimeout(()=>client.writeData({ data: { loadingInit: false } }), 100);
			})
			.catch((err)=>{
				setError(err);
			})
	}
	
	return {
		error,
		loading,
		isUserLoggedIn,
		initialized
	}
}

async function init() {
	try {
		const token = localStorage.getItem('@flakery/userToken');
		
		if (token) {
			
			const { data } = await client.mutate({ mutation: AUTHENTICATE, variables: { token } })
			/* 	.catch((err)=>{
					console.error(err, token);
				}); */
			logUserIn(data.authenticate, token);
			
			const initialData = await loadInitialData();
			if (!initialData) throw new Error('Não foi possível carregar os dados iniciais');

			client.writeData({ data: { userToken: token } });
		}

		client.writeData({ data: { initialized: true } });

		return true;
	} catch (e) {
		logUserOut();
		throw e;
	}
}

export function logUserIn (user, token) {
	localStorage.setItem('@flakery/userToken', token);
	client.writeData({ data: { loadingInit: true, isUserLoggedIn: true, userToken: token, loggedUserId: user.id } });
}

export function logUserOut () {
	localStorage.removeItem('@flakery/userToken');
	localStorage.removeItem('@flakery/selectedCompany');
	localStorage.removeItem('@flakery/selectedCompany');
	client.writeData({ data: { userToken: null, loadingInit: true, isUserLoggedIn: false } });
	client.resetStore();
}

function loadInitialData() {
	const { loggedUserId } = client.readQuery({ query: LOGGED_USER_ID });
	return client.query({ query: GET_USER_COMPANIES, variables: { id: loggedUserId } })
		.then (async ({ data: { user: { companies = [] } = {} } = {} }) => {
			const { selectedCompany } = client.readQuery({ query: GET_SELECTED_COMPANY });
			const selectCompanyId = selectedCompany || companies[0].id;

			await client.mutate({ mutation: SET_SELECTED_COMPANY, variables: { id: selectCompanyId } });

			return true;
		});
}