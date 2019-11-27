import React, {useState} from 'react';
import PageForm from './form';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import {setPageTitle} from '../../utils';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { UPDATE_CATEGORY } from '../../graphql/categories';

const LOAD_CATEGORY = gql`
	query ($id: ID!) {
		category (id: $id) {
			id
			name
			image
			description
			createdAt
			active
		}
	}
`;

function Page (props) {
	setPageTitle('Alterar categoria');

	const edit_id = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const {data, loading:loadingGetData, error} = useQuery(LOAD_CATEGORY, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (error) return <ErrorBlock error={error} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const category = {
		name: data.category.name,
		description: data.category.description || '',
		file : '',
		preview: data.category.image,
		active: data.category.active,
	};

	function onSubmit(values, {setSubmitting}) {

		const data = {name:values.name, description:values.description, active:values.active};
		if (values.file) data.file = values.file;

		client.mutate({mutation:UPDATE_CATEGORY, variables:{id:edit_id, data}})
		.then(()=>{
			setDisplaySuccess('A categoria salva');
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
		<>
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
				pageTitle='Alterar categoria'
				initialValues={category}
				onSubmit={onSubmit}
				edit={edit_id}
				/>
		</>
	)
}

export default Page;