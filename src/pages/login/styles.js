import { Paper } from '@material-ui/core';

import styled from 'styled-components';

export const Container = styled.div`
	display:flex;
	justify-content:stretch;
	height:100%;
`;

export const LoginPanel = styled(Paper)`
	border-radius:0 !important;
	display:flex;
	flex-direction:column;
	align-items:stretch;
	justify-content:center;
	width:23%;
	margin-top:-200px;
	min-width:350px;
	max-width:550px;
	box-sizing:border-box;
`;

export const LoginArea = styled.form`
	display: block;
	margin:30px 30px 0 30px;
`;

export const LoginLabel = styled.h1`
	color:#707070;
	font-size:18px;
	font-weight:normal;
`;

export const ImagePanel = styled.div`
	flex:1;
	background-size:cover;
	background-position:center;
	background-image:url(${props=>props.image});
`;