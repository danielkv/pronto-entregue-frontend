import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PageForm from './form';
import {setPageTitle, joinMetas, initialMetas} from '../../utils';
import Layout from '../../layout';
import { GET_USER_COMPANIES } from '../../graphql/companies';

const CREATE_BRANCH = gql`
	mutation ($data:BranchInput!) {
		createBranch (data:$data) {
			id
			name
			last_month_revenue
			createdAt
			active
		}
	}
`;

function Page (props) {
	setPageTitle('Nova filial');
	
	const client = useApolloClient();

	const branch = {
		name:'',
		active:true,
		...initialMetas(['address', 'document', 'phone', 'email'])
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({mutation:CREATE_BRANCH, variables:{data}, refetchQueries:[{query:GET_USER_COMPANIES}]})
		.catch((err)=>{
			console.error(err);
		})
		.finally(()=>{
			setSubmitting(false);
		})
	}
	
	return (
		<Layout>
			<PageForm
				onSubmit={onSubmit}
				initialValues={branch}
				pageTitle='Nova filial'
				validateOnChange={false}
			/>
		</Layout>
	)
}

export default Page;