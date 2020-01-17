import React from 'react';

import { useMutation } from '@apollo/react-hooks';

import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { GET_CATEGORIES, CREATE_CATEGORY } from '../../graphql/categories';

function Page (props) {
	setPageTitle('Nova categoria');

	const [createCategory, { error: errorSaving }] = useMutation(CREATE_CATEGORY, { refetchQueries: [{ query: GET_CATEGORIES }] })

	const category = {
		name: '',
		description: '',
		file: '',
		preview: '',
		active: true,
	};

	function onSubmit(values) {
		const data = { name: values.name, description: values.description, active: values.active, file: values.file };

		return createCategory({ variables: { data } })
			.then(({ data: { createCategory } })=>{
				props.history.push(`/category/alterar/${createCategory.id}`);
			})
	}

	if (errorSaving) return <ErrorBlock error={getErrors(errorSaving)} />
	
	return (
		<PageForm
			onSubmit={onSubmit}
			initialValues={category}
			pageTitle='Nova categoria'
			validateOnChange={false}
		/>
	)
}

export default Page;