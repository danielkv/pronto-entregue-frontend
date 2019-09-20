import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PageForm from './form';
import {setPageTitle, joinMetas, initialMetas} from '../../utils';
import Layout from '../../layout';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_BRANCHES, GET_SELECTED_BRANCH } from '../../graphql/branches';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';

const CREATE_USER = gql`
	mutation ($id:ID!, $data:UserInput!) {
		createUser (id: $id, data:$data) {
			id
			full_name
			role
			createdAt
			active
		}
	}
`;

const LOAD_BRANCH = gql`
	query ($id: ID!) {
		branch (id: $id) {
			id
			name
		}
	}
`;

function Page (props) {
	setPageTitle('Novo usuário');
	
	const client = useApolloClient();

	//busca filial selecionada para ser vincular
	const {data:selectedBranchData, loading:loadingSelectedBranch} = useQuery(GET_SELECTED_BRANCH);
	const {data:userBranchData, loading:loadingUserBranch, error} = useQuery(LOAD_BRANCH, {variables:{id: selectedBranchData.selectedBranch}});

	if (error) return <ErrorBlock error={error} />
	if (loadingSelectedBranch || loadingUserBranch) return (<LoadingBlock />);

	//normaliza filial para ser vinculada
	const assignBranch = userBranchData ? userBranchData.branch : '';
	if (assignBranch) {
		delete assignBranch.__typename;
		assignBranch.action = 'assign';
		assignBranch.user_relation = {role_id:'', active:true};
	}

	const metas = ['document', 'addresses', 'phones'];

	const user = {
		first_name: '',
		last_name: '',
		email: '',
		active: '',
		password: '',
		assigned_branches: [],
		...initialMetas(metas)
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(metas, values)};
		delete data.address;
		delete data.phones;
		delete data.emails;
		delete data.document;

		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});

		client.mutate({mutation:CREATE_USER, variables:{data}, refetchQueries:[{query:GET_COMPANY_BRANCHES, variables:{id:selectedCompany}}]})
		.catch((err)=>{
			console.error(err);
		})
		.finally(()=>{
			setSubmitting(false);
		})
	}
	
	return (
		<Layout>
			<PageForm
				onSubmit={onSubmit}
				initialValues={user}
				assignBranch={assignBranch}
				selectedBranch={selectedBranchData.selectedBranch}
				pageTitle='Novo usuário'
				validateOnChange={false}
			/>
		</Layout>
	)
}

export default Page;