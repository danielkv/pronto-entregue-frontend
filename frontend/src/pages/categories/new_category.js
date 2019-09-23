import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_BRANCH_CATEGORIES, CREATE_CATEGORY } from '../../graphql/categories';

function Page (props) {
	setPageTitle('Nova categoria');
	
	const client = useApolloClient();

	const item = {
		name:'',
		description:'',
		active:true,
	};

	function onSubmit(data, {setSubmitting}) {
		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});

		client.mutate({mutation:CREATE_CATEGORY, variables:{data}, refetchQueries:[{query:GET_BRANCH_CATEGORIES, variables:{id:selectedCompany}}]})
		.then(({data:{createCategory}})=>{
			props.history.push(`/category/alterar/${createCategory.id}`);
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
				initialValues={item}
				pageTitle='Nova categoria'
				validateOnChange={false}
			/>
		</Layout>
	)
}

export default Page;