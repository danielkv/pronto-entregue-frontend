import React, {useState} from 'react';
import PageForm from './form';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { UPDATE_ITEM } from '../../graphql/items';

const LOAD_ITEM = gql`
	query ($id: ID!) {
		item (id: $id) {
			id
			name
			description
			createdAt
			active
		}
	}
`;

function Page (props) {
	setPageTitle('Alterar item de estoque');

	const edit_id = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const {data, loading:loadingGetData, error} = useQuery(LOAD_ITEM, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (error) return <ErrorBlock error={error} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const item = {
		name: data.item.name,
		description: data.item.description,
		active: data.item.active,
	};

	function onSubmit(data, {setSubmitting}) {

		client.mutate({mutation:UPDATE_ITEM, variables:{id:edit_id, data}})
		.then(()=>{
			setDisplaySuccess('O item de estoque foi salvo');
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
				pageTitle='Alterar item de estoque'
				initialValues={item}
				onSubmit={onSubmit}
				/>
		</Layout>
	)
}

export default Page;