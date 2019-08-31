import styled from 'styled-components';

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

export const Sidebar = styled.aside`
	background-color:#f00;
	width:300px;
`;

export const Content = styled.div`
	flex:1;
	margin-right:65px;
`;

export const BlockTitle = styled.h2`
	font-size:18px;
	font-weight:normal;
	color:#707070;
	margin-top:5px;
`
