import React, { useState } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import gql from 'graphql-tag';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { sanitizeCategory, extractCategory } from '../../utils/categories';
import { getErrors } from '../../utils/error';
import PageForm from './form';

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

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_CATEGORY, { variables: { id: editId } });
	const [updateCategory, { error: savingError }] = useMutation(UPDATE_CATEGORY, { variables: { id: editId } })

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	// extract category data coming from DB
	const category = extractCategory(data.category);

	function onSubmit(result) {
		const data = sanitizeCategory(result);

		return updateCategory({ variables: { data } })
			.then(()=>{
				setDisplaySuccess('A categoria salva');
			})
	}

	return (
		<>
			<Snackbar
				open={!!savingError}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<SnackbarContent className='error' message={!!savingError && getErrors(savingError)} />
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
				edit={editId}
			/>
		</>
	)
}

export default Page;