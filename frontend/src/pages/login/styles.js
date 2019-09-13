import styled from 'styled-components';
import { Paper } from '@material-ui/core';

export const Container = styled.div`
	display:flex;
	justify-content:stretch;
	height:100%;
`;

export const LoginPanel = styled(Paper)`
	border-radius:0 !important;
	display:flex;
	flex-direction:column;
	align-items:center;
	justify-content:flex-start;
	width:23%;
	padding-top:10%;
	min-width:350px;
	max-width:550px;
	box-sizing:border-box;
`;

export const LoginArea = styled.form`
	margin-top:30px;
	width:100%;
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