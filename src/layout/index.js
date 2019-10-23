import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

import {Container, HeaderArea, NavigationArea, Main} from './components';
import Header from './header';
import Navigation from './navigation';

export default function Layout (_props) {
	return (
		<ThemeProvider theme={theme}>
			<Container>
				<HeaderArea>
					<Header />
				</HeaderArea>
				<NavigationArea>
					<Navigation />
				</NavigationArea>
				<Main>
					{_props.children}
				</Main>
			</Container>
		</ThemeProvider>
	)
}