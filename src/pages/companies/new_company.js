import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { setPageTitle } from '../../utils';
import { sanitizeCompany, createEmptyCompany } from '../../utils/companies';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { GET_COMPANIES, CREATE_COMPANY } from '../../graphql/companies';

const FILE_SIZE = 3000 * 1024;

const companySchema = Yup.object().shape({
	name: Yup.string().required('Nome é obrigatório'),
	displayName: Yup.string().required('Razão social é obrigatório'),
	backgroundColor: Yup.string().required('Cor principal é obrigatória'),
	file: Yup.mixed().required('Selecione uma imagem')
		.test('fileSize', 'A imagem é muito grande. Máximo 5MB', value => value && value.size <= FILE_SIZE),
	document: Yup.object().shape({
		value: Yup.string().required('Documento é brigatório')
	}),
	type: Yup.object().shape({
		id: Yup.mixed().required('Ramo de atividade é obrigatório')
	}),
	contact: Yup.object().shape({
		value: Yup.string().required('Responsável é obrigatório')
	}),
	address: Yup.object().shape({
		name: Yup.string(),
		street: Yup.string().required('Rua obrigatório'),
		number: Yup.number().typeError('Número do endereço deve ser um número').required('Número do endereço é brigatório'),
		zipcode: Yup.string().required('CEP obrigatório'),
		district: Yup.string().required('Bairro é obrigatório'),
		city: Yup.string().required('Cidade é obrigatório'),
		state: Yup.string().required('Estado é obrigatório'),
		location: Yup.array().of(Yup.string().required('Você não setou a localização.')).min(2).max(2),
	}),
	phones: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Telefone é obrigatório')
	})).min(1),
	emails: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Email é obrigatório').email('O Email não é válido'),
	})).min(1),
});

function Page ({ history, match: { url } }) {
	setPageTitle('Nova empresa');
	const splitedUrl = url.substr(1).split('/')
	const prefixUrl = `/${splitedUrl[0]}/${splitedUrl[1]}`;
	
	const { enqueueSnackbar } = useSnackbar();
	const [createCompany] = useMutation(CREATE_COMPANY, { refetchQueries: [{ query: GET_COMPANIES }] });

	const initialValues = createEmptyCompany();

	function onSubmit(result) {
		const data = sanitizeCompany(result);

		return createCompany({ variables: { data } })
			.then(({ data: { createCompany } })=>{
				enqueueSnackbar('A empresa foi criada com sucesso', { variant: 'success' });
				history.push(`${prefixUrl}/alterar/${createCompany.id}`);
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}
	
	return (
		<Formik
			validationSchema={companySchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
		>
			{(props)=><PageForm {...props} pageTitle='Nova empresa' />}
		</Formik>
	)
}

export default Page;