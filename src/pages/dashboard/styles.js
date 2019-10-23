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

export const BestSellersContainer = styled.div`
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