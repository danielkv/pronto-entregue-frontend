import React from 'react';
import PageForm from './form';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import {setPageTitle, extractMetas, joinMetas} from '../../utils';
import Layout from '../../layout';
import { UPDATE_USER } from '../../graphql/users';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';

export const LOAD_USER = gql`
	query ($id: ID!) {
		user (id: $id) {
			id
			first_name
			last_name
			email
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
	setPageTitle('Alterar usuário');

	const edit_id = props.match.params.id;
	
	const {data, loading:loadingGetData, error:errorGetData} = useQuery(LOAD_USER, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (errorGetData) return <ErrorBlock error={errorGetData} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const user = {
		first_name: data.user.first_name,
		last_name: data.user.last_name,
		email: data.user.email,
		active: data.user.active,
		...extractMetas(['document', 'phones'], data.user.metas)
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({mutation:UPDATE_USER, variables:{id:edit_id, data}})
		.catch((err)=>{
			console.error(err.graphQLErrors, err.networkError, err.operation);
		})
		.finally(() => {
			setSubmitting(false);
		})
	}

	return (
		<Layout>
			<PageForm
				pageTitle='Alterar usuário'
				initialValues={user}
				onSubmit={onSubmit}
				edit={true}
				/>
		</Layout>
	)
}

export default Page;