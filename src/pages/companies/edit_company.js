import React, { useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { extractCompany, sanitizeCompany } from '../../utils/companies';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { UPDATE_COMPANY, LOAD_COMPANY } from '../../graphql/companies';

const companySchema = Yup.object().shape({
	name: Yup.string().required('Nome é obrigatório'),
	displayName: Yup.string().required('Razão social é obrigatório'),
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

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//carrega empresa
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COMPANY, { variables: { id: editId } });
	const [updateCompany, { error: errorSaving }] = useMutation(UPDATE_COMPANY, { variables: { id: editId } })

	
	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingGetData) return (<LoadingBlock />);

	// extract company data coming from DB
	const initialValues = extractCompany(data.company);

	function onSubmit(result) {
		const data = sanitizeCompany(result);

		return updateCompany({ variables: { data } })
			.then(()=>{
				setDisplaySuccess('A empresa foi salva');
			})
	}
	
	return (
		<Fragment>
			<Snackbar
				open={!!errorSaving}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<SnackbarContent className='error' message={!!errorSaving && getErrors(errorSaving)} />
			</Snackbar>
			<Snackbar
				open={!!displaySuccess}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplaySuccess('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='success' message={!!displaySuccess && displaySuccess} />
			</Snackbar>
			<Formik
				validationSchema={companySchema}
				initialValues={initialValues}
				onSubmit={onSubmit}
				validateOnChange={false}
				validateOnBlur={false}
			>
				{(props)=><PageForm {...props} pageTitle='Alterar empresa' />}
			</Formik>
		</Fragment>
	)
}

export default Page;