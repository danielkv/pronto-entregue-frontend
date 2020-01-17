import React from 'react';

import { useApolloClient } from '@apollo/react-hooks';

import { setPageTitle } from '../../utils';
import PageForm from './form';

import { GET_CATEGORIES, CREATE_CATEGORY } from '../../graphql/categories';

function Page (props) {
	setPageTitle('Nova categoria');
	
	const client = useApolloClient();

	const item = {
		name: '',
		description: '',
		file: '',
		preview: '',
		active: true,
	};

	function onSubmit(values, { setSubmitting }) {
		const data = { name: values.name, description: values.description, active: values.active, file: values.file };
		//const file = values.file;

		client.mutate({ mutation: CREATE_CATEGORY, variables: { data }, refetchQueries: [{ query: GET_CATEGORIES }] })
			.then(({ data: { createCategory } })=>{
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