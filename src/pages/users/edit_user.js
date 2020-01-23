import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractUser, sanitizeUserData } from '../../utils/users';
import PageForm from './form';

import { UPDATE_USER, LOAD_USER } from '../../graphql/users';

const userSchema = Yup.object().shape({
	firstName: Yup.string().required('Obrigatório'),
	lastName: Yup.string().required('Obrigatório'),
	email: Yup.string().required('Obrigatório'),
	password: Yup.mixed().test('test_force_password', 'Você deve digitar uma senha', function () {
		if (this.parent.forcePassword)
			return false;
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
	setPageTitle('Alterar usuário');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	//busca usuário para edição
	const selectedCompany = useSelectedCompany();
	const { data, loading: loadingGetData, error: errorGetData } = useQuery(LOAD_USER, { variables: { id: editId, companyId: selectedCompany } });

	const [updateUser, { error: errorSaving }] = useMutation(UPDATE_USER, { variables: { id: editId, companyId: selectedCompany } });

	if (errorGetData) return <ErrorBlock error={getErrors(errorGetData)} />
	if (loadingGetData) return (<LoadingBlock />);

	// extract all user data
	const user = extractUser(data.user);
	
	function onSubmit(values) {
		// eslint-disable-next-line no-param-reassign
		const data = sanitizeUserData(values);

		return updateUser({ mutation: UPDATE_USER, variables: { data } })
			.then(()=>{
				setDisplaySuccess('O usuário foi salvo');
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
				validationSchema={userSchema}
				initialValues={user}
				onSubmit={onSubmit}
				validateOnChange={true}
				validateOnBlur={false}
				render={(props)=><PageForm {...props} edit pageTitle='Alterar usuário' />}
			/>
		</Fragment>
	)
}

export default Page;