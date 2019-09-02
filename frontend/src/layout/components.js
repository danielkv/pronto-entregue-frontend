import styled from 'styled-components';
import { Paper } from '@material-ui/core';

export const Container = styled.div`
	display:grid;
	grid-template-columns: 130px auto;
	grid-template-rows: 95px auto;

	grid-template-areas:"header header"
						"navigation main";

						grid-gap:20px;
	@media (min-width:769px) {
		grid-gap:27px;
	}
	@media (min-width:1439px) {
		grid-gap:35px;
	}
`;

export const HeaderArea = styled.div`
	grid-area:header;
`;

export const NavigationArea = styled.div`
	grid-area:navigation;
`;

export const Main = styled.main`
	grid-area:main;
	display:flex;

`;

export const SidebarContainer = styled.aside`
	width:300px;
`;

export const Sidebar = styled(Paper)`
	border-top-right-radius:0 !important;
	border-bottom-right-radius:0 !important;

	display:flex;
	flex-direction:column;
	justify-items:stretch;
`;

export const Content = styled.div`
	flex:1;
	margin-right:65px;
`;

export const BlockSeparator = styled.div`
	border-bottom: 1px solid #ddd;
`;

export const Block = styled.div`
	margin-bottom:25px;

	& ${BlockSeparator}:last-child {
		margin-bottom:0;
	}
`
export const BlockHeader = styled.div`
	display:flex;
	justify-content:space-between;
	align-items:center;
`
export const BlockFooter = styled.div`
	display:flex;
	justify-content:space-between;
	align-items:flex-start;
`

export const BlockTitle = styled.h2`
	font-size:18px;
	font-weight:normal;
	color:#707070;
	margin-top:5px;
`

export const NumberOfRows = styled.div`
	font-size:14px;
	font-weight:lighter;
	color:#707070;
	text-align:right;
	margin:8px 8px 8px 0;
	align-self:flex-end;
`

export const CircleNumber = styled.div`
	background-color:#F0F0F0;
	border-radius:20px;
	width:36px;
	height:36px;
	text-align:center;
	color:#D41450;
	font-size:15px;
	font-weight:bold;
	display:flex;
	align-items:center;
	justify-content:center;
`;

export const FormRow = styled.div`
	display:flex;
	justify-items:stretch;
	padding:0 15px 10px 15px;

	${Block} &:first-child {
		padding-top:20px;
	}
	${Block} &:last-child {
		padding-bottom:30px;
	}
`;

export const FieldControl = styled.div`
	flex:1;
	display:flex;
	align-items:flex-end;
	margin: 0 15px;
`;
