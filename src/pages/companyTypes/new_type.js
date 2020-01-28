import React from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { createEmptyCompanyType, sanitizeCompanyType } from '../../utils/companyType';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { GET_COMPANY_TYPES, CREATE_COMPANY_TYPE } from '../../graphql/companyTypes';

const FILE_SIZE = 500 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	file: Yup.mixed().required('Selecione uma imagem').test('fileSize', 'Essa imagem é muito grande. Máximo 500kb', value => value && value.size <= FILE_SIZE)
});

function Page () {
	setPageTitle('Nova categoria');
	const history = useHistory();

	const [createCompanyType, { error: errorSaving }] = useMutation(CREATE_COMPANY_TYPE, { refetchQueries: [{ query: GET_COMPANY_TYPES }] })

	const initialValues = createEmptyCompanyType();

	function onSubmit(result) {
		const data = sanitizeCompanyType(result);

		return createCompanyType({ variables: { data } })
			.then(({ data: { createCompanyType } })=>{
				history.push(`/ramos/alterar/${createCompanyType.id}`);
			})
	}

	if (errorSaving) return <ErrorBlock error={getErrors(errorSaving)} />
	
	return (
		<Formik
			validationSchema={validationSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={true}
			validateOnBlur={false}
		>
			{(props)=><PageForm {...props} pageTitle='Novo ramo de atividade' />}
		</Formik>
	)
}

export default Page;