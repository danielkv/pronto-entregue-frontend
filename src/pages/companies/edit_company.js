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
	name: Yup.string().required('Obrigatório'),
	displayName: Yup.string().required('Obrigatório'),
	document: Yup.object().shape({
		value: Yup.string().required('Obrigatório')
	}),
	contact: Yup.object().shape({
		value: Yup.string().required('Obrigatório')
	}),
	address: Yup.object().shape({
		value: Yup.object().shape({
			street: Yup.string().required('Obrigatório'),
			number: Yup.number().typeError('Deve ser um número').required('Obrigatório'),
			zipcode: Yup.string().required('Obrigatório'),
			district: Yup.string().required('Obrigatório'),
			city: Yup.string().required('Obrigatório'),
			state: Yup.string().required('Obrigatório'),
		})
	}),
	phones: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Obrigatório')
	})).min(1),
	emails: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Obrigatório').email('Email não é válido'),
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
				validateOnChange={true}
				validateOnBlur={false}
			>
				{(props)=><PageForm {...props} pageTitle='Alterar empresa' />}
			</Formik>
		</Fragment>
	)
}

export default Page;