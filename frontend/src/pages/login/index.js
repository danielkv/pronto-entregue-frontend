import React, { useState } from 'react';
import {TextField, Button} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import {useMutation} from '@apollo/react-hooks';

import theme from '../../layout/theme';
import imageLogo from '../../assets/images/logo-full.png';
import {setPageTitle} from '../../utils';
import {Container, LoginPanel, LoginArea, ImagePanel, LoginLabel} from './styles';
import { FormRow, FieldControl } from '../../layout/components';
import gql from 'graphql-tag';

const backgrounds = [
	require('../../assets/images/bg1.jpg'),
	require('../../assets/images/bg2.jpg'),
	require('../../assets/images/bg3.jpg'),
];

const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				first_name
			}
			token
		}
	}
`;
const image = backgrounds[Math.round(Math.random()*(backgrounds.length-1))];

function Page () {
	setPageTitle('Login');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	const [userLogin, {data, loading, error}] = useMutation(LOGIN);

	if (data) console.log(data);
	if (error) console.log(error.message);

	function handleLogin (e) {
		e.preventDefault();

		userLogin({variables:{email, password}});
	}

	return (
		<ThemeProvider theme={theme}>
			<Container>
				<LoginPanel>
					<img src={imageLogo} alt='Flakery - Flaker Delivery' />
					<LoginArea>
						<FormRow>
							<FieldControl>
								<LoginLabel>Faça o login</LoginLabel>
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField value={email} onChange={({target})=>{setEmail(target.value)}}  label='Email' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField required value={password} onChange={({target})=>{setPassword(target.value)}} type="password" label='Senha' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Button onClick={handleLogin} fullWidth type='submit' variant="contained" color='secondary'>Acessar</Button>
							</FieldControl>
						</FormRow>
					</LoginArea>
				</LoginPanel>
			
				<ImagePanel image={image}>

				</ImagePanel>
			</Container>
		</ThemeProvider>
	)
}

export default Page;