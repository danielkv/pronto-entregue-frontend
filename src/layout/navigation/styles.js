import { Link } from 'react-router-dom';

import { List, ListItem } from '@material-ui/core';

import styled from 'styled-components';

export const Container = styled.div`
	margin-left: ${({ theme }) => theme.spacing(1)}px;
	@media (max-width: 1400px) {
		margin-left: ${({ theme }) => theme.spacing(1)*.6}px;
	}
`;

export const NavigationContainer = styled(List).attrs(() => ({ component: 'nav' }))`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const NavItem = styled(ListItem).attrs(() => ({ button: true, component: Link }))`
	border-radius: 23px !important;

	&.settings {
		margin-top:30px
	}

	margin-bottom:5px;
	&:last-child {
		margin-bottom:0;
	}

`;
