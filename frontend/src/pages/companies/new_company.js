import React from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle, joinMetas, initialMetas} from '../../utils';
import Layout from '../../layout';

const CREATE_COMPANY = gql`
	mutation ($data:CompanyInput!) {
		createCompany (data:$data) {
			id
			name
			display_name
			createdAt
			active
			metas {
				id
				meta_type
				meta_value
			}
		}
	}
`;

function Page (props) {
	setPageTitle('Nova empresa');
	
	const client = useApolloClient();

	const company = {
		name:'',
		display_name:'',
		active:true,
		...initialMetas(['address', 'document', 'contact', 'phones', 'emails'])
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.contact;
		delete data.phones;
		delete data.emails;
		delete data.document;

		console.log(data);

		client.mutate({mutation:CREATE_COMPANY, variables:{data}})
		.then(({data, error}) => {
			if (error) console.error(error);
			
			setSubmitting(false);
		})
		.catch((err)=>{
			console.error(err.graphQLErrors, err.networkError, err.operation);
		})
	}
	
	return (
		<Layout>
			<PageForm
				onSubmit={onSubmit}
				initialValues={company}
				pageTitle='Nova empresa'
				validateOnChange={false}
			/>
		</Layout>
	)
}

export default Page;