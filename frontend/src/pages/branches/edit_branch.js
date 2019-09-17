import React from 'react';
import PageForm from './form';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import {setPageTitle, extractMetas, joinMetas} from '../../utils';
import Layout from '../../layout';
import { UPDATE_BRANCH } from '../../graphql/branches';
import LoadingBlock from '../../layout/loadingBlock';

export const LOAD_BRANCH = gql`
	query ($id: ID!) {
		branch (id: $id) {
			id
			name
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
	setPageTitle('Alterar filial');

	const edit_id = props.match.params.id;
	
	const {data, loading:loadingGetData} = useQuery(LOAD_BRANCH, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (!data || loadingGetData) return (<LoadingBlock />);

	const branch = {
		name: data.branch.name,
		active: data.branch.active,
		...extractMetas(data.branch.metas, ['address', 'document', 'phone', 'email'])
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({mutation:UPDATE_BRANCH, variables:{id:edit_id, data}})
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
				pageTitle='Alterar filial'
				initialValues={branch}
				onSubmit={onSubmit}
				/>
		</Layout>
	)
}

export default Page;