import { Paper } from '@material-ui/core';

import styled from 'styled-components';

export const DashContainer = styled.div`
	display:grid;
	grid-template-columns: 50% 50%;
	grid-template-areas: "orders orders"
						"topsales lastorders";

	@media (max-width: 1400px) {
		grid-template-areas: "orders orders"
						"lastorders lastorders"
						"topsales topsales";
	}

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
	padding:30px 20px;
	display:flex;
	justify-content:space-evenly;
`;

export const OrderStatus = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	& > div {
		display: flex;
		flex-direction: column;
	}
	img {
		float:left;
		margin-right:10px;
	}
	h4 {
		font-size: 1.3rem;
		color:#D41450;
		margin:12px 0 4px;
	}
	span {
		font-size:14px;
		font-weight:lighter;
		color:#707070;
	}
`;