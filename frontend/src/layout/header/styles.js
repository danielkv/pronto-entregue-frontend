import styled from 'styled-components';
import {Paper} from '@material-ui/core';

export const HeaderContainer = styled(Paper).attrs(props=>({elevation:2}))`
	display:flex;
	align-items:stretch;
	height:70px;
`;

export const LogoContainer = styled.div`
	background-color:#FBAE17;
	display:flex;
	align-items:center;
	padding:0 45px 0 35px;
	border-radius: 0 50px 50px 0;
	margin-right:30px;
`;

export const SelectContainer = styled.div`
	display:flex;
	align-items:center;
	margin-right:30px;
	& > svg {
		margin-right:8px;
	}
`;
