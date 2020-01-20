import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractUser, sanitizeUserData } from '../../utils/users';
import PageForm from './form';

import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { UPDATE_USER, LOAD_USER } from '../../graphql/users';

function Page (props) {
	setPageTitle('Alterar usuário');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//busca usuário para edição
	const { data: { selectedCompany } } = useQuery(GET_SELECTED_COMPANY);
	const { data, loading: loadingGetData, error: errorGetData } = useQuery(LOAD_USER, { variables: { id: editId, companyId: selectedCompany } });

	const [updateUser, { error: errorSaving }] = useMutation(UPDATE_USER, { variables: { id: editId } });

	if (errorGetData) return <ErrorBlock error={getErrors(errorGetData)} />
	if (loadingGetData) return (<LoadingBlock />);

	// extract all user data
	const user = extractUser(data.user);

	function onSubmit(values) {
		// eslint-disable-next-line no-param-reassign
		const data = sanitizeUserData(values);

		return updateUser({ mutation: UPDATE_USER, variables: { data } })
			.then(()=>{
				setDisplaySuccess('O usuário foi salvo');
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
				pageTitle='Alterar usuário'
				initialValues={user}
				onSubmit={onSubmit}
				selectedCompany={selectedCompany}
				// assignBranch={assignBranch}
				edit={true}
			/>
		</Fragment>
	)
}

export default Page;