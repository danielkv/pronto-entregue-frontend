import styled from 'styled-components';
import { Paper } from '@material-ui/core';

export const ModalPaper = styled(Paper)`
	width:40%;
	max-width:730px;
`;

export const ModalHeader = styled.div`
	padding:30px 30px 15px 30px;
	display:flex;
`;

export const ProductInfo = styled.div`
	display:flex;
	flex-direction:column;
	justify-content:center;
`;

export const ProductTitle = styled.div`
	font-size:20px;
	margin-bottom:8px;
	font-weight:bold;
	color:#707070;
`;

export const ProductAmount = styled.div`
	font-size:18px;
	font-weight:normal;
	color:#707070;
`;

export const ProductImage = styled.div`
	background-size: cover;
	background-image:${props=>`url(${props.src})`};
	width:110px;
	height:110px;
	border-radius:55px;
	float:left;
	margin-right:15px;
`;