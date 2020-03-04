import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { extractCompany, sanitizeCompany } from '../../utils/companies';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { UPDATE_COMPANY, LOAD_COMPANY } from '../../graphql/companies';

const FILE_SIZE = 500 * 1024;

const companySchema = Yup.object().shape({
	name: Yup.string().required('Nome é obrigatório'),
	displayName: Yup.string().required('Razão social é obrigatório'),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => !value || value.size <= FILE_SIZE),
	document: Yup.object().shape({
		value: Yup.string().required('Documento é brigatório')
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
		location: Yup.array().of(Yup.string()).min(2).max(2).required('Você não setou a localização.'),
	}),
	phones: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Telefone é obrigatório')
	})).min(1),
	emails: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Email é obrigatório').email('O Email não é válido'),
	})).min(1),
});

function Page () {
	setPageTitle('Alterar empresa');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	
	//carrega empresa
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COMPANY, { variables: { id: editId } });
	const [updateCompany] = useMutation(UPDATE_COMPANY, { variables: { id: editId } })

	
	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingGetData) return (<LoadingBlock />);

	// extract company data coming from DB
	const initialValues = extractCompany(data.company);

	function onSubmit(result) {
		const data = sanitizeCompany(result);

		return updateCompany({ variables: { data } })
			.then(()=>{
				enqueueSnackbar('A empresa foi alterada com sucesso', { variant: 'success' });
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
			{(props)=><PageForm {...props} pageTitle='Alterar empresa' />}
		</Formik>
	)
}

export default Page;