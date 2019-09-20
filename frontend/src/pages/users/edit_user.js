import React, {useState} from 'react';
import PageForm from './form';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import {setPageTitle, extractMetas, joinMetas} from '../../utils';
import Layout from '../../layout';
import { UPDATE_USER } from '../../graphql/users';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';

const LOAD_USER = gql`
	query ($id: ID!, $company_id:ID!) {
		user (id: $id) {
			id
			first_name
			last_name
			email
			createdAt
			active
			role
			company(company_id:$company_id) {
				id
				user_relation {
					active
				}
				assigned_branches {
					id
					name
					user_relation {
						active
						role_id
					}
				}
			}
			metas {
				id
				meta_type
				meta_value
				action @client
			}
		}
	}
`;

const LOAD_USER_BRANCH = gql`
	query ($id: ID!) {
		branch (id: $id) {
			id
			name
		}
	}
`;

function Page (props) {
	setPageTitle('Alterar usuário');

	const edit_id = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//busca usuário para edição
	const {data:selectedCompanyData, loading:loadingSelectedCompany} = useQuery(GET_SELECTED_COMPANY);
	const {data, loading:loadingGetData, error:errorGetData} = useQuery(LOAD_USER, {variables:{id:edit_id, company_id:selectedCompanyData.selectedCompany}});

	//busca filial selecionada para ser vincular
	const {data:selectedBranchData, loading:loadingSelectedBranch} = useQuery(GET_SELECTED_BRANCH);
	const {data:userBranchData, loading:loadingUserBranch} = useQuery(LOAD_USER_BRANCH, {variables:{id: selectedBranchData.selectedBranch}});
	
	//normaliza filial para ser vinculada
	const assignBranch = userBranchData ? userBranchData.branch : '';
	if (assignBranch) {
		delete assignBranch.__typename;
		assignBranch.action = 'assign';
		assignBranch.user_relation = {role_id:'', active:true};
	}

	const client = useApolloClient();

	if (errorGetData) return <ErrorBlock error={errorGetData} />
	if (!data || loadingGetData || loadingSelectedCompany || loadingSelectedBranch || loadingUserBranch) return (<LoadingBlock />);

	const metas = ['document', 'addresses', 'phones'];
	const user = {
		first_name: data.user.first_name,
		last_name: data.user.last_name,
		email: data.user.email,
		active: data.user.active,
		role: data.user.role,
		password: '',
		assigned_company: {
			active : data.user.company.user_relation.active,
		},
		assigned_branches: data.user.company.assigned_branches.map(branch=>{delete branch.__typename; delete branch.user_relation.__typename; return {...branch, action:''}}),
		...extractMetas(metas, data.user.metas)
	};

	function onSubmit(values, {setSubmitting}) {
		values = JSON.parse(JSON.stringify(values));
		const data = {...values, metas:joinMetas(metas, values)};
		delete data.addresses;
		delete data.phones;
		delete data.document;
		
		data.assigned_branches = values.assigned_branches.map(branch => {delete branch.name; return branch});	

		client.mutate({mutation:UPDATE_USER, variables:{id:edit_id, data}})
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
				pageTitle='Alterar usuário'
				initialValues={user}
				onSubmit={onSubmit}
				selectedBranch={selectedBranchData.selectedBranch}
				assignBranch={assignBranch}
				edit={true}
				/>
		</Layout>
	)
}

export default Page;