import React from 'react';

import { Container, HeaderArea, NavigationArea, Main } from './components';

import Header from './header';
import Navigation from './navigation';

export default function Layout (_props) {
	return (
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
	)
}