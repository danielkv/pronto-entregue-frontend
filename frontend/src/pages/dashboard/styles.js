import styled from 'styled-components';
import {Paper} from '@material-ui/core';

export const DashContainer = styled.div`
	display:grid;
	grid-template-columns: 50% 50%;
	grid-template-areas: "orders orders"
						"topsales lastorders";

	grid-gap:35px;
`;

export const OrdersTodayContainer = styled.div`
	grid-area:orders;
`;

export const TopSalesContainer = styled.div`
	grid-area:topsales;
`;

export const LastSalesContainer = styled.div`
	grid-area:lastorders;
`;

export const OrdersToday = styled(Paper)`
	padding:30px 0;
	display:flex;
	justify-content:space-evenly;
`;

export const OrderStatus = styled.div`
	width:225px;
	img {
		float:left;
		margin-right:10px;
	}
	h4 {
		font-size:18px;
		font-weight:bold;
		color:#D41450;
		margin:12px 0 4px;
	}
	div {
		font-size:14px;
		font-weight:lighter;
		color:#707070;
	}
`;

export const ProdCount = styled.div`
	background-color:#F0F0F0;
	border-radius:20px;
	width:36px;
	height:36px;
	text-align:center;
	color:#D41450;
	font-size:18px;
	font-weight:bold;
	display:flex;
	align-items:center;
	justify-content:center;
`;

export const ProdImg = styled.div`
	background-size: cover;
	background-image:${props=>`url(${props.src})`};
	width:60px;
	height:60px;
	border-radius:30px;
`;

export const OrderCreated = styled.div`
	display:flex;
	flex-direction:column;
`;

export const OrderDate = styled.div`
	font-size:16px;
	font-weight:lighter;
`;

export const OrderTime = styled.div`
	font-size:18px;
	font-weight:normal;
`;