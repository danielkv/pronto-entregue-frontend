import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { createEmptyCategory, sanitizeCategory } from '../../utils/categories';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { GET_COMPANY_CATEGORIES, CREATE_CATEGORY } from '../../graphql/categories';

const FILE_SIZE = 500 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	description: Yup.string().required('A descrição é obrigatória'),
	file: Yup.mixed().required('Selecione uma imagem')
		.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => !value || value.size <= FILE_SIZE),
});

function Page ({ history }) {
	setPageTitle('Nova categoria');

	const selectedCompany = useSelectedCompany();
	const [createCategory, { error: errorSaving }] = useMutation(CREATE_CATEGORY, { refetchQueries: [{ query: GET_COMPANY_CATEGORIES, variables: { id: selectedCompany } }] })

	const initialValues = createEmptyCategory();

	function onSubmit(result) {
		const data = sanitizeCategory(result);

		return createCategory({ variables: { data } })
			.then(({ data: { createCategory } })=>{
				history.push(`/categorias/alterar/${createCategory.id}`);
			})
	}

	if (errorSaving) return <ErrorBlock error={getErrors(errorSaving)} />
	
	return (
		<Formik
			validationSchema={validationSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
		>
			{(props)=><PageForm {...props} pageTitle='Nova categoria' />}
		</Formik>
	)
}

export default Page;