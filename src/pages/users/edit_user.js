

import React, { useState, Fragment } from 'react';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { joinMetas, extractMetas } from '../../utils/metas';
import PageForm from './form';

import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { UPDATE_USER, LOAD_USER } from '../../graphql/users';

function Page (props) {
	setPageTitle('Alterar usuário');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//busca usuário para edição
	const { data: selectedCompanyData } = useQuery(GET_SELECTED_COMPANY);
	const { data, loading: loadingGetData, error: errorGetData } = useQuery(LOAD_USER, { variables: { id: editId, companyId: selectedCompanyData.selectedCompany } });

	//busca filial selecionada para ser vincular
	/* const { data: { selectedCompany }, loading: loadingselectedCompany } = useQuery(GET_SELECTED_COMPANY);
	const { data: userBranchData, loading: loadingUserBranch } = useQuery(LOAD_USER_COMPANY, { variables: { id: selectedCompany } });
	
	//normaliza filial para ser vinculada
	const assignBranch = userBranchData ? userBranchData.branch : '';
	if (assignBranch) {
		delete assignBranch.__typename;
		assignBranch.action = 'assign';
		assignBranch.userRelation = { roleId: '', active: true };
	} */

	const client = useApolloClient();

	if (errorGetData) return <ErrorBlock error={getErrors(errorGetData)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const metas = ['document', 'addresses', 'phones'];
	const user = {
		firstName: data.user.firstName,
		lastName: data.user.lastName,
		email: data.user.email,
		active: data.user.active,
		role: data.user.role,
		password: '',
		assignedCompany: {
			active: data.user.company.userRelation.active,
		},
		...extractMetas(metas, data.user.metas)
	};

	function onSubmit(values, { setSubmitting }) {
		// eslint-disable-next-line no-param-reassign
		values = JSON.parse(JSON.stringify(values));
		const data = { ...values, metas: joinMetas(metas, values) };
		delete data.addresses;
		delete data.phones;
		delete data.document;

		client.mutate({ mutation: UPDATE_USER, variables: { id: editId, data } })
			.then(()=>{
				setDisplaySuccess('O usuário foi salvo');
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
				pageTitle='Alterar usuário'
				initialValues={user}
				onSubmit={onSubmit}
				selectedCompany={selectedCompanyData.selectedCompany}
				// assignBranch={assignBranch}
				edit={true}
			/>
		</Fragment>
	)
}

export default Page;