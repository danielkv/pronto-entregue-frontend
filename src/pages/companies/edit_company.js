import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { extractCompany, sanitizeCompany } from '../../utils/companies';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { UPDATE_COMPANY, LOAD_COMPANY } from '../../graphql/companies';

function Page (props) {
	setPageTitle('Alterar empresa');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//carrega empresa
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COMPANY, { variables: { id: editId } });
	const [updateCompany, { error: errorSaving }] = useMutation(UPDATE_COMPANY, { variables: { id: editId } })

	
	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingGetData) return (<LoadingBlock />);

	// extract company data coming from DB
	const company = extractCompany(data.company);

	function onSubmit(result) {
		const data = sanitizeCompany(result);

		return updateCompany({ variables: { data } })
			.then(()=>{
				setDisplaySuccess('A empresa foi salva');
			})
	}
	
	return (
		<Fragment>
			<Snackbar
				open={!!errorSaving}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<SnackbarContent className='error' message={!!errorSaving && getErrors(errorSaving)} />
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