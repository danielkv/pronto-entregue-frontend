import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PageForm from './form';
import {setPageTitle, joinMetas, initialMetas} from '../../utils';

import { GET_USER_COMPANIES } from '../../graphql/companies';
import { LOGGED_USER_ID } from '../../graphql/authentication';

const CREATE_COMPANY = gql`
	mutation ($data:CompanyInput!) {
		createCompany (data:$data) {
			id
			name
			display_name
			last_month_revenue
			createdAt
			active
		}
	}
`;

function Page (props) {
	setPageTitle('Nova empresa');
	
	const client = useApolloClient();
	const { loggedUserId } = client.readQuery({ query: LOGGED_USER_ID });
	const [createCompany] = useMutation(CREATE_COMPANY, { refetchQueries: [{ query: GET_USER_COMPANIES, variables: { id: loggedUserId } }] });

	const metas = ['address', 'document', 'contact', 'phones', 'emails'];
	const company = {
		name:'',
		display_name:'',
		active:true,
		...initialMetas(metas)
	};

	function onSubmit(values) {
		const data = {...values, metas:joinMetas(metas, values)};
		delete data.address;
		delete data.contact;
		delete data.phones;
		delete data.emails;
		delete data.document;

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