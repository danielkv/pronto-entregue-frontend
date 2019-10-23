import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PageForm from './form';
import {setPageTitle, joinMetas, initialMetas} from '../../utils';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_BRANCHES } from '../../graphql/branches';

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
		...initialMetas(['address', 'document', 'phones', 'emails'])
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.phones;
		delete data.emails;
		delete data.document;

		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});

		client.mutate({mutation:CREATE_BRANCH, variables:{data}, refetchQueries:[{query:GET_COMPANY_BRANCHES, variables:{id:selectedCompany}}]})
		.catch((err)=>{
			console.error(err);
		})
		.finally(()=>{
			setSubmitting(false);
		})
	}
	
	return (
		<PageForm
			onSubmit={onSubmit}
			initialValues={branch}
			pageTitle='Nova filial'
			validateOnChange={false}
		/>
	)
}

export default Page;