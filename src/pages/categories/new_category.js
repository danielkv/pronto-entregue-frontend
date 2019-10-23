import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle} from '../../utils';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_BRANCH_CATEGORIES, CREATE_CATEGORY } from '../../graphql/categories';

function Page (props) {
	setPageTitle('Nova categoria');
	
	const client = useApolloClient();

	const item = {
		name:'',
		description:'',
		file:'',
		preview:'',
		active:true,
	};

	function onSubmit(values, {setSubmitting}) {
		const {selectedCompany} = client.readQuery({query:GET_SELECTED_COMPANY});

		const data = {name:values.name, description:values.description, active:values.active, file:values.file};
		//const file = values.file;

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
		<PageForm
			onSubmit={onSubmit}
			initialValues={item}
			pageTitle='Nova categoria'
			validateOnChange={false}
		/>
	)
}

export default Page;