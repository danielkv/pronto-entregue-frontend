import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle, extractMetas, joinMetas} from '../../utils';
import Layout from '../../layout';
import LoadingBlock from '../../layout/loadingBlock';
import { UPDATE_COMPANY } from '../../graphql/companies';


export const LOAD_COMPANY = gql`
	query ($id: ID!) {
		company (id: $id) {
			id
			name
			display_name
			createdAt
			active
			metas {
				id
				meta_type
				meta_value
				action @client
			}
		}
	}
`;

function Page (props) {
	setPageTitle('Alterar empresa');

	const edit_id = props.match.params.id;
	
	const {data, loading:loadingGetData} = useQuery(LOAD_COMPANY, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (!data || loadingGetData) return (<LoadingBlock />);

	const company = {
		name: data.company.name,
		display_name: data.company.display_name,
		active: data.company.active,
		...extractMetas(data.company.metas, ['address', 'document', 'contact', 'phone', 'email'])
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.contact;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({mutation:UPDATE_COMPANY, variables:{id:edit_id, data}})
		.then(({data}) => {
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
				pageTitle='Alterar empresa'
			/>
		</Layout>
	)
}

export default Page;