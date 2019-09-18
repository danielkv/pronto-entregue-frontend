import React from 'react';
import Layout from '.';
import {Loading, Content, BlockContainer, LoadingText, ErrorTitle, ErrorSubtitle} from './components';

export const LoadingBlock = () => (
	<Layout>
		<Content>
			<BlockContainer>
				<Loading size='40' />
				<LoadingText>Carregando...</LoadingText>
			</BlockContainer>
		</Content>
	</Layout>
)

export const ErrorBlock = ({error}) => {
	return (
		<Layout>
			<Content>
				<BlockContainer>
					<ErrorTitle>Ocorreu um erro</ErrorTitle>
					<ErrorSubtitle>{error.message}</ErrorSubtitle>
				</BlockContainer>
			</Content>
		</Layout>
	)
}