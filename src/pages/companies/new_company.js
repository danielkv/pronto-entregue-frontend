import React from 'react';

import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { setPageTitle } from '../../utils';
import { metaTypes, sanitizeCompanyData } from '../../utils/companies';
import { initialMetas } from '../../utils/metas';
import PageForm from './form';

import { LOGGED_USER_ID } from '../../graphql/authentication';
import { GET_USER_COMPANIES } from '../../graphql/companies';

const CREATE_COMPANY = gql`
	mutation ($data:CompanyInput!) {
		createCompany (data:$data) {
			id
			name
			displayName
			lastMonthRevenue
			createdAt
			active
		}
	}
`;

function Page () {
	setPageTitle('Nova empresa');
	
	const client = useApolloClient();
	const { loggedUserId } = client.readQuery({ query: LOGGED_USER_ID });
	const [createCompany] = useMutation(CREATE_COMPANY, { refetchQueries: [{ query: GET_USER_COMPANIES, variables: { id: loggedUserId } }] });

	const company = {
		name: '',
		displayName: '',
		active: true,
		...initialMetas(metaTypes)
	};

	function onSubmit(result) {
		const data = sanitizeCompanyData(result);

		return createCompany({ variables: { data } })
			.catch((err)=>{
				console.error(err);
			})
	}
	
	return (
		<PageForm
			onSubmit={onSubmit}
			initialValues={company}
			pageTitle='Nova empresa'
			validateOnChange={false}
		/>
	)
}

export default Page;