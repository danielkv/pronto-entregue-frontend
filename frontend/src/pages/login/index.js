import React from 'react';
import {TextField, Button} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';

import theme from '../../layout/theme';
import imageLogo from '../../assets/images/logo-full.png';
import {setPageTitle} from '../../utils';
import {Container, LoginPanel, LoginArea, ImagePanel, LoginLabel} from './styles';
import { FormRow, FieldControl } from '../../layout/components';

const backgrounds = [
	require('../../assets/images/bg1.jpg'),
	require('../../assets/images/bg2.jpg'),
	require('../../assets/images/bg3.jpg'),
];

function Page () {
	setPageTitle('Login');
	
	const image = backgrounds[Math.round(Math.random()*(backgrounds.length-1))];

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
								<TextField label='Email' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField type="password" label='Senha' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Button fullWidth type='submit' variant="contained" color='secondary'>Acessar</Button>
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