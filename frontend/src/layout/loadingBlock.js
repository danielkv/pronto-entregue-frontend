import React from 'react';
import Layout from '.';
import {Loading, Content, LoadingContainer, LoadingText} from './components';

export default () => (
	<Layout>
		<Content>
			<LoadingContainer>
				<Loading size='40' />
				<LoadingText>Carregando...</LoadingText>
			</LoadingContainer>
		</Content>
	</Layout>
)