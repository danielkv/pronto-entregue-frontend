import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PageForm from './form';
import Layout from '../../layout';
import {setPageTitle, joinMetas, initialMetas} from '../../utils';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { GET_COMPANY_USERS } from '../../graphql/users';

const CREATE_USER = gql`
	mutation ($data:UserInput!) {
		createUser (data:$data) {
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
		password: '',
		active:true,
		assigned_branches: [],
		...initialMetas(metas)
	};

	function onSubmit(values, {setSubmitting}) {
		values = JSON.parse(JSON.stringify(values));
		const data = {...values, metas:joinMetas(metas, values)};
		delete data.addresses;
		delete data.phones;
		delete data.document;

		data.assigned_branches = values.assigned_branches.map(branch => {delete branch.name; return branch});

		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});

		client.mutate({mutation:CREATE_USER, variables:{data}, refetchQueries:[{query:GET_COMPANY_USERS, variables:{id:selectedCompany}}]})
		.then(({data:{createUser}})=>{
			props.history.push(`/usuarios/alterar/${createUser.id}`);
		})
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