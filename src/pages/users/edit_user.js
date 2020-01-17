

import React, { useState, Fragment } from 'react';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import gql from 'graphql-tag';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle, extractMetas, joinMetas } from '../../utils';
import PageForm from './form';

import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { UPDATE_USER } from '../../graphql/users';

const LOAD_USER = gql`
	query ($id: ID!, $companyId:ID!) {
		user (id: $id) {
			id
			firstName
			lastName
			email
			createdAt
			active
			role
			company(companyId:$companyId) {
				id
				userRelation {
					active
				}
				assigned_branches {
					id
					name
					userRelation {
						active
						roleId
					}
				}
			}
			metas {
				id
				key
				value
				action @client
			}
		}
	}
`;

const LOAD_USER_COMPANY = gql`
	query ($id: ID!) {
		branch (id: $id) {
			id
			name
		}
	}
`;

function Page (props) {
	setPageTitle('Alterar usuário');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//busca usuário para edição
	const { data: selectedCompanyData, loading: loadingSelectedCompany } = useQuery(GET_SELECTED_COMPANY);
	const { data, loading: loadingGetData, error: errorGetData } = useQuery(LOAD_USER, { variables: { id: editId, companyId: selectedCompanyData.selectedCompany } });

	//busca filial selecionada para ser vincular
	const { data: selectedBranchData, loading: loadingSelectedBranch } = useQuery(GET_SELECTED_COMPANY);
	const { data: userBranchData, loading: loadingUserBranch } = useQuery(LOAD_USER_COMPANY, { variables: { id: selectedBranchData.selectedBranch } });
	
	//normaliza filial para ser vinculada
	const assignBranch = userBranchData ? userBranchData.branch : '';
	if (assignBranch) {
		delete assignBranch.__typename;
		assignBranch.action = 'assign';
		assignBranch.userRelation = { roleId: '', active: true };
	}

	const client = useApolloClient();

	if (errorGetData) return <ErrorBlock error={errorGetData} />
	if (!data || loadingGetData || loadingSelectedCompany || loadingSelectedBranch || loadingUserBranch) return (<LoadingBlock />);

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
				selectedBranch={selectedBranchData.selectedBranch}
				assignBranch={assignBranch}
				edit={true}
			/>
		</Fragment>
	)
}

export default Page;