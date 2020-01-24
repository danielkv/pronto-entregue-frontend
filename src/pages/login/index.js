/* eslint-disable no-undef */
import React, { useState } from 'react';

import { useApolloClient } from '@apollo/react-hooks';
import { TextField, Button, Snackbar, SnackbarContent } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { FormRow, FieldControl } from '../../layout/components';

import imageLogo from '../../assets/images/logo-full.png';
import theme from '../../layout/theme';
import { logUserIn } from '../../services/init';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { Container, LoginPanel, LoginArea, ImagePanel, LoginLabel } from './styles';

import { LOGIN } from '../../graphql/authentication';


const backgrounds = [
	require('../../assets/images/bg1.jpg'),
	require('../../assets/images/bg2.jpg'),
	require('../../assets/images/bg3.jpg'),
];

const image = backgrounds[Math.round(Math.random()*(backgrounds.length-1))];

const LoginSchema = Yup.object().shape({
	email: Yup.string()
		.email('Email inválido')
		.required('Obrigatório'),
	password: Yup.string()
		.required('Obrigatório'),
});


function Page () {
	setPageTitle('Login');

	//const history = useHistory();

	const client = useApolloClient();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const initialValues = {
		email: process.env.NODE_ENV === 'production' ? '' : 'daniel_kv@hotmail.com',
		password: process.env.NODE_ENV === 'production' ? '' : '123456',
	}

	function handleLogin ({ email, password }) {
		setLoading(true);

		client.mutate({ mutation: LOGIN, variables: { email, password } })
			.then(({ data })=>{
				if (data.login.token) {
					logUserIn(data.login.user, data.login.token);
				}
			})
			.catch(e=>{
				setError(e);
			}).finally(()=>{
				setLoading(false);
			});
	}

	return (
		<ThemeProvider theme={theme}>
			<Container>
				<LoginPanel>
					<img src={imageLogo} alt='Flakery - Flaker Delivery' />
					<Formik
						initialValues={initialValues}
						validationSchema={LoginSchema}
						onSubmit={handleLogin}
						validateOnChange={false}
					>
						{({ handleChange, handleSubmit, errors, values }) =>
							(<LoginArea >
								<FormRow>
									<FieldControl>
										<LoginLabel>Faça o login</LoginLabel>
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<TextField disabled={loading} name='email' value={values.email} error={!!errors.email} helperText={errors.email} onChange={handleChange} label='Email' />
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<TextField disabled={loading} name='password' value={values.password} error={!!errors.password} helperText={errors.password} onChange={handleChange} type="password" label='Senha' />
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<Button disabled={loading} onClick={handleSubmit} fullWidth type='submit' variant="contained" color='secondary'>Acessar</Button>
									</FieldControl>
								</FormRow>
								<Snackbar
									open={!!error}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									onClose={()=>{setError(null)}}
									autoHideDuration={4000}
								>
									<SnackbarContent className='error' message={!!error && getErrors(error)} />
								</Snackbar>
							</LoginArea>)}
					</Formik>
				</LoginPanel>
				<ImagePanel image={image}>

				</ImagePanel>
			</Container>
		</ThemeProvider>
	)
}

export default Page;