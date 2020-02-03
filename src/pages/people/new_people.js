import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizePeople, createEmptyPeople } from '../../utils/peoples';
import PageForm from './form';

import { GET_COMPANY_USERS, CREATE_USER } from '../../graphql/users';

const userSchema = Yup.object().shape({
	firstName: Yup.string().required('Obrigatório'),
	lastName: Yup.string().required('Obrigatório'),
	email: Yup.string().required('Obrigatório'),
	password: Yup.mixed().test('test_force_password', 'Você deve digitar uma senha', function (value) {
		if (this.parent.forcePassword)
			return Boolean(value);
		return true;
	}),
	document: Yup.object().shape({
		value: Yup.string().required('Obrigatório')
	}),
	phones: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Obrigatório')
	})).min(1),
});


function Page (props) {
	setPageTitle('Novo usuário');
	
	const selectedCompany = useSelectedCompany();
	const [createUser, { error: errorSaving }] = useMutation(CREATE_USER, { refetchQueries: [{ query: GET_COMPANY_USERS, variables: { id: selectedCompany } }] })

	const user = createEmptyPeople();

	function onSubmit(result) {
		const data = sanitizePeople(result);
		
		return createUser({ variables: { data } })
			.then(({ data: { createUser } })=>{
				props.history.push(`/usuarios/alterar/${createUser.id}`);
			});
	}

	if (errorSaving) return <ErrorBlock error={getErrors(errorSaving)} />
	
	return (
		<Formik
			validationSchema={userSchema}
			initialValues={user}
			onSubmit={onSubmit}
			validateOnChange={true}
			validateOnBlur={false}
		>
			{(props)=><PageForm {...props} pageTitle='Novo usuário' />}
		</Formik>
	)
}

export default Page;