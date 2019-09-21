import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PageForm from './form';
import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_ITEMS } from '../../graphql/items';

const CREATE_ITEM = gql`
	mutation ($data:ItemInput!) {
		createItem (data:$data) {
			id
			name
			createdAt
			active
		}
	}
`;

function Page (props) {
	setPageTitle('Novo item de estoque');
	
	const client = useApolloClient();

	const item = {
		name:'',
		description:'',
		active:true,
	};

	function onSubmit(data, {setSubmitting}) {
		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});

		client.mutate({mutation:CREATE_ITEM, variables:{data}, refetchQueries:[{query:GET_COMPANY_ITEMS, variables:{id:selectedCompany}}]})
		.then(({data:{createItem}})=>{
			props.history.push(`/estoque/alterar/${createItem.id}`);
		})
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
				initialValues={item}
				pageTitle='Novo item de estoque'
				validateOnChange={false}
			/>
		</Layout>
	)
}

export default Page;