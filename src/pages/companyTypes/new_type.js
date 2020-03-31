import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { createEmptyCompanyType, sanitizeCompanyType } from '../../utils/companyType';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { GET_COMPANY_TYPES, CREATE_COMPANY_TYPE } from '../../graphql/companyTypes';

const FILE_SIZE = 500 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	description: Yup.string().required('A descrição é obrigatória'),
	file: Yup.mixed().required('Selecione uma imagem').test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => value && value.size <= FILE_SIZE)
});

function Page ({ history, match: { url } }) {
	setPageTitle('Nova categoria');
	const splitedUrl = url.substr(1).split('/')
	const prefixUrl = `/${splitedUrl[0]}/${splitedUrl[1]}`;

	const { enqueueSnackbar } = useSnackbar();

	const [createCompanyType, { error: errorSaving }] = useMutation(CREATE_COMPANY_TYPE, { refetchQueries: [{ query: GET_COMPANY_TYPES }] })

	const initialValues = createEmptyCompanyType();

	function onSubmit(result) {
		const data = sanitizeCompanyType(result);

		return createCompanyType({ variables: { data } })
			.then(({ data: { createCompanyType } })=>{
				enqueueSnackbar('O ramo de atividade foi criado com sucesso', { variant: 'success' });
				history.push(`${prefixUrl}/alterar/${createCompanyType.id}`);
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
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
			{(props)=><PageForm {...props} pageTitle='Novo ramo de atividade' />}
		</Formik>
	)
}

export default Page;