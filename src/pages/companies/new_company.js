import React from 'react';

import { useMutation } from '@apollo/react-hooks';

import { setPageTitle } from '../../utils';
import { sanitizeCompany, createEmptyCompany } from '../../utils/companies';
import PageForm from './form';

import { GET_COMPANIES, CREATE_COMPANY } from '../../graphql/companies';

function Page () {
	setPageTitle('Nova empresa');
	
	const [createCompany] = useMutation(CREATE_COMPANY, { refetchQueries: [{ query: GET_COMPANIES }] });

	const company = createEmptyCompany();

	function onSubmit(result) {
		const data = sanitizeCompany(result);

		return createCompany({ variables: { data } })
			.catch((err)=>{
				console.error(err);
			})
	}
	
	return (
		<PageForm
			onSubmit={onSubmit}
			initialValues={company}
			pageTitle='Nova empresa'
			validateOnChange={false}
		/>
	)
}

export default Page;