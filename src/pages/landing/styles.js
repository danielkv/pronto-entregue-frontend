import styled, { css } from 'styled-components';

import deliveryImg from '../../assets/images/delivery-bike.png'

export const HeaderContentContainer = styled.div`
	display: flex;
	flex: 1;
	height: 100%;
	background: #000a;
	align-items: flex-start;
	flex-direction: column;
`;
export const TopNav = styled.nav`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 80px;
`;
export const LogoImg = styled.img`
	width: 60px;
	height: auto;
	@media (max-width: 600px) {
		width: 40px;
	}
`;
export const TopContent = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const Header = styled.header`
	background: url(${deliveryImg}) no-repeat right 100% top 0;
	height: 700px;
	background-color: #f0f0f0;
	text-align: center;
	color: #f0f0f0;
	overflow: hidden;

	@media (max-width: 1024px) {
		height: 550px;
		font-size: 14px;
	}
	@media (max-width: 600px) {
		height: 400px;
		font-size: 10px;
	}
`
export const FeaturesContainer = styled.header`
	display: flex;
	justify-content: space-between;
	margin-top: 30px;
	width: 500px;
	max-width: 100%;
	
`;
export const Feature = styled.div`
	display: flex;
	flex-direction: column;
	align-items:center;
	width: 130px;

	div {
		width: 40px;
		height: 40px;
	}
	
	span {
		line-height: normal;
		font-size: 1em;
		margin-top: 15px;
	}

	@media (max-width: 600px) {
		div {
			width: 30px;
			height: 30px;
		}
	}
`;

export const BackgroudLine = styled.section`
	border: 1px solid #707070;
	height: 100%;
	position: absolute;
	top:0;
	left: 50%;
	@media (max-width: 600px) {
		left: 16px;
	}
	/* margin-left: -1px; */
`;

export const FeatureDetailsContainer = styled.section`
	position: relative;
	overflow: hidden;
	background-color: #EFE8DA;
	padding: 5% 0;
`;

export const FeatureDetails = styled.div`
	display: flex;
	position: relative;
	align-items:center;
	height: 650px;

	@media (max-width: 1024px) {
		height: 500px;
	}

	@media (max-width: 600px) {
		margin: 5% 0;
		height: auto;
	}
`;
export const Dot = styled.div`
	display: block;
	width: 22px;
	height: 22px;
	background-color: #707070;
	border-radius: 12px;
	position: absolute;
`;

export const FeaturedContent = styled.div`
	display: flex;
	flex-direction: column;
	width: 50%;
	
	@media (max-width: 1024px) {
		font-size: 14px;
	}
	@media (max-width: 600px) {
		font-size: 10px;
		width: 100%;
		margin-right: 0;
		margin-left: 30px;
		${Dot} {
			left: 0;
			right: auto;
			margin-right: 0;
			margin-left: -36px !important;
			width: 15px;
			height: 15px;
		}
	}

	${({ position }) =>
		(position === 'left'
			? css`
				${Dot} {
					right: 0;
					margin-right: -12px;
				}
			`
			: css`
				margin-right: -80px;
				${Dot} {
					left: 0;
					margin-left: -90px;
				}
			`)}

`;
export const FeaturedTitle = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	color: #F11761;
	position: relative;

	h3 {
		margin-left: 15px;
		text-transform: uppercase;
		font-size: 1.8em;
	}
`;
export const FeaturedDescription = styled.div`
	color: #333;
	margin-top: 30px;
	padding-right: 100px;

	p {
		font-size: 1.1em;
		margin-bottom: 15px;
	}

	@media (max-width: 1024px) {
		padding-right: 50px;
	}
	@media (max-width: 600px) {
		padding-right: 0;
	}
`;
export const FeaturedImage = styled.img`
	position: absolute;

	${({ type })=>{
		if (type === 'desktop')
			return css`
				left: 100%;
				margin-left: -600px;
			`;
		if (type === 'status')
			return css`
				right: 100%;
				margin-right: -500px;
			`;
		if (type === 'app')
			return css`
				left: 100%;
				margin-left: -500px;
				margin-top: 200px;
			`;
	}}

	@media (max-width: 1024px) {
		${({ type })=>{
		if (type === 'desktop')
			return css`
					left: 100%;
					margin-left: -400px;
					height: 450px;
				`;
		if (type === 'status')
			return css`
					right: 100%;
					margin-right: -340px;
					height: 450px;
				`;
		if (type === 'app')
			return css`
					left: 100%;
					margin-left: -350px;
					margin-top: 0;
					height: 550px;
				`;
	}}
	}
	@media (max-width: 600px) {
		display: none;
	}
`;

export const Footer = styled.footer`
	display: flex;
	flex-direction: column;
	background-color: #CCC4B3;
	height: 400px;
	align-items: center;
	justify-content: center;
`;
export const AppsDownloadContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 400px;
	max-width: 90%;
	flex-wrap: wrap;
	text-align:center;
	margin-bottom: 30px;

	img {
		width: 48%;
		height: auto;
	}
`;
export const PhoneNumber = styled.div`
	display: flex;
	align-items: center;
	margin: 15px 0;

	div {
		width: 30px;
		height: 30px;
	}
	p {
		font-size: 1.5em;
		margin-left: 15px;
	}
`;