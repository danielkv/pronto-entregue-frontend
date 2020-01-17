import React, { useState, Fragment } from 'react';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import gql from 'graphql-tag';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle, extractMetas, joinMetas } from '../../utils';
import PageForm from './form';

import { UPDATE_COMPANY } from '../../graphql/companies';


export const LOAD_COMPANY = gql`
	query ($id: ID!) {
		company (id: $id) {
			id
			name
			displayName
			createdAt
			active
			metas {
				id
				key
				value
				action @client
			}
		}
	}
`;

function Page (props) {
	setPageTitle('Alterar empresa');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//carrega empresa
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COMPANY, { variables: { id: editId } });
	const client = useApolloClient();

	if (error) return <ErrorBlock error={error} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const metas = ['address', 'document', 'contact', 'phones', 'emails'];

	const company = {
		name: data.company.name,
		displayName: data.company.displayName,
		active: data.company.active,
		...extractMetas(metas, data.company.metas)
	};

	function onSubmit(values, { setSubmitting }) {
		const data = { ...values, metas: joinMetas(metas, values) };
		delete data.address;
		delete data.contact;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({ mutation: UPDATE_COMPANY, variables: { id: editId, data } })
			.then(()=>{
				setDisplaySuccess('A empresa foi salva');
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
		<Fragment>
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
				onSubmit={onSubmit}
				initialValues={company}
				pageTitle='Alterar empresa'
			/>
		</Fragment>
	)
}

export default Page;