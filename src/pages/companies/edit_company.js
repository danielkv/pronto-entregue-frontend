import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractMetas, joinMetas } from '../../utils/metas';
import PageForm from './form';

import { UPDATE_COMPANY, LOAD_COMPANY } from '../../graphql/companies';

function Page (props) {
	setPageTitle('Alterar empresa');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//carrega empresa
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COMPANY, { variables: { id: editId } });
	const [updateCompany, { error: displayError }] = useMutation(UPDATE_COMPANY, { variables: { id: editId } })

	
	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingGetData) return (<LoadingBlock />);

	if (!data) return false;

	const metas = ['address', 'document', 'contact', 'phones', 'emails'];

	const company = {
		name: data.company.name,
		displayName: data.company.displayName,
		active: data.company.active,
		...extractMetas(metas, data.company.metas)
	};

	function onSubmit(values) {
		const data = { ...values, metas: joinMetas(metas, values) };
		delete data.address;
		delete data.contact;
		delete data.phones;
		delete data.emails;
		delete data.document;

		return updateCompany({ variables: { data } })
			.then(()=>{
				setDisplaySuccess('A empresa foi salva');
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