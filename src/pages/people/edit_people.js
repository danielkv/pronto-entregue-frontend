import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractPeople, sanitizePeople } from '../../utils/peoples';
import PageForm from './form';

import { UPDATE_USER, LOAD_USER } from '../../graphql/users';

const userSchema = Yup.object().shape({
	firstName: Yup.string().required('O primeiro nome é obrigatório'),
	lastName: Yup.string().required('O sobrenome é obrigatório'),
	email: Yup.string().required('O email é obrigatório'),
	password: Yup.mixed().test('test_force_password', 'Você deve digitar uma senha', function (value) {
		if (this.parent.forcePassword)
			return Boolean(value);
		return true;
	}),
	document: Yup.object().shape({
		value: Yup.string().required('Digite o documento')
	}),
	phones: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Digite pelo menos 1 número de telefone')
	})).min(1),
});

function Page () {
	setPageTitle('Alterar pessoa');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	
	//busca pessoa para edição
	const selectedCompany = useSelectedCompany();
	const { data, loading: loadingGetData, error: errorGetData } = useQuery(LOAD_USER, { variables: { id: editId, companyId: selectedCompany } });

	const [updateUser] = useMutation(UPDATE_USER, { variables: { id: editId, companyId: selectedCompany } });
	
	function onSubmit(values) {
		// eslint-disable-next-line no-param-reassign
		const data = sanitizePeople(values);
		
		return updateUser({ mutation: UPDATE_USER, variables: { data } })
			.then(()=>{
				enqueueSnackbar('O usuário foi alterada com sucesso', { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}
	
	if (errorGetData) return <ErrorBlock error={getErrors(errorGetData)} />
	if (loadingGetData) return (<LoadingBlock />);

	// extract all user data
	const user = extractPeople(data.user);
	
	return (
		<Formik
			validationSchema={userSchema}
			initialValues={user}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
		>
			{(props)=><PageForm {...props} edit pageTitle='Alterar pessoa' />}
		</Formik>
	)
}

export default Page;