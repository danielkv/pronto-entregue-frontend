import { Paper } from '@material-ui/core';

import styled from 'styled-components';

export const ModalPaper = styled(Paper)`
	width:40%;
	max-width:730px;
	/* max-height:80%;
	overflow-y:auto !important; */
`;

export const ModalHeader = styled.div`
	padding:30px 30px 15px 30px;
	display:flex;
`;

export const ProductInfo = styled.div`
	display:flex;
	margin-left: 20px;
	flex-direction:column;
	justify-content:center;

`;

export const ProductTitle = styled.div`
	font-size:20px;
	margin-bottom:8px;
	font-weight:bold;
	color:#707070;
	display:flex;
	flex-direction: row;
	align-items:center;
`;

export const QuantityContainer = styled.span`
	float:right;
	display: flex;
	flex-direction: row;
	margin-left:10px;
	align-items:center;

	& > div {
		margin: 0 8px;
	}
`;

export const ProductPrice = styled.div`
	font-size:18px;
	font-weight:normal;
	color:#707070;
`;