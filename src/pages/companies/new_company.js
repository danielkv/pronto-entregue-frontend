import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { setPageTitle } from '../../utils';
import { sanitizeCompany, createEmptyCompany } from '../../utils/companies';
import PageForm from './form';

import { GET_COMPANIES, CREATE_COMPANY } from '../../graphql/companies';

const companySchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	displayName: Yup.string().required('Obrigatório'),
	type: Yup.object().shape({
		id: Yup.mixed().required('Obrigatório'),
		name: Yup.string().required('Obrigatório')
	}),
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
	setPageTitle('Nova empresa');
	
	const [createCompany] = useMutation(CREATE_COMPANY, { refetchQueries: [{ query: GET_COMPANIES }] });

	const initialValues = createEmptyCompany();

	function onSubmit(result) {
		const data = sanitizeCompany(result);

		return createCompany({ variables: { data } })
			.catch((err)=>{
				console.error(err);
			})
	}
	
	return (
		<Formik
			validationSchema={companySchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={true}
			validateOnBlur={false}
		>
			{(props)=><PageForm {...props} pageTitle='Nova empresa' />}
		</Formik>
	)
}

export default Page;