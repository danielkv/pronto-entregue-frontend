import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Paper} from '@material-ui/core';

export const NavigationContainer = styled(Paper).attrs(props=>({elevation:2}))`
	display:flex;
	flex-direction:column;
	align-items:center;
	width:70px;
	padding:16px 0;
	border-radius:35px !important;
	margin-left:35px;
`;

export const NavItem = styled(Link)`
	border-radius:23px;
	width:43px;
	height:43px;
	display:flex;
	align-items:center;
	justify-content:center;
	
	transition: background-color .2s;

	&.settings {
		margin-top:30px
	}

	margin-bottom:5px;
	&:last-child {
		margin-bottom:0;
	}

	${({selected}) =>{
		if (selected)
			return (`
				background-color:#D41450;
				svg path {
					fill:white !important;
				}`
			)
		else 
			return (`
				&:hover {
					background-color:#F0F0F0;
				}`
			)
	}}

	
`;