import React from 'react';
import {TextField} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';

import theme from '../../layout/theme';
import imageLogo from '../../assets/images/logo-full.png';
import {setPageTitle} from '../../utils';
import {Container, LoginPanel, LoginArea, ImagePanel, LoginLabel} from './styles';

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
						<LoginLabel>Faça o login</LoginLabel>
						<TextField label='Email' />
						<TextField type="password" label='Senha' />
					</LoginArea>
				</LoginPanel>
			
				<ImagePanel image={image}>

				</ImagePanel>
			</Container>
		</ThemeProvider>
	)
}

export default Page;