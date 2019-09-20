import React, {useState} from 'react';
import PageForm from './form';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import {setPageTitle, extractMetas, joinMetas} from '../../utils';
import Layout from '../../layout';
import { UPDATE_BRANCH } from '../../graphql/branches';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';

const LOAD_BRANCH = gql`
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

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const {data, loading:loadingGetData, error} = useQuery(LOAD_BRANCH, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (error) return <ErrorBlock error={error} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const metas = ['address', 'document', 'phones', 'emails'];
	const branch = {
		name: data.branch.name,
		active: data.branch.active,
		...extractMetas(metas, data.branch.metas)
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(metas, values)};
		delete data.address;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({mutation:UPDATE_BRANCH, variables:{id:edit_id, data}})
		.then(()=>{
			setDisplaySuccess('A filial foi salva');
		})
		.catch((err)=>{
			setDisplayError(err.message);
			console.error(err.graphQLErrors, err.networkError, err.operation);
		})
		.finally(() => {
			setSubmitting(false);
		})
	}

	return (
		<Layout>
			<Snackbar
				open={!!displayError}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplayError('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='error' message={!!displayError && displayError} />
			</Snackbar>
			<Snackbar
				open={!!displaySuccess}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplaySuccess('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='success' message={!!displaySuccess && displaySuccess} />
			</Snackbar>
			<PageForm
				pageTitle='Alterar filial'
				initialValues={branch}
				onSubmit={onSubmit}
				/>
		</Layout>
	)
}

export default Page;