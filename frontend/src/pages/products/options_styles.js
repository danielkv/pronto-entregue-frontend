import styled from 'styled-components';

export const OptionRow = styled.div`
	display:flex;
	justify-content:center;
	align-content:flex-start;
	font-size:15px;
	color:#333;
	border-bottom:1px solid #dfdfdf;
	background-color:#F3f3f3;
`;

export const OptionHead = styled(OptionRow)`
	font-size:13px;
	color:#666;
	justify-content:center;
`;

export const OptionColumn = styled.div`
	padding: 18px 30px;
	display:flex;
	align-items:center;

	&.spaceDraggable {
		margin-left:81px;
	}
`;

export const OptionsInfo = styled.div`
	display:flex;
	margin-left:auto;
	align-self:flex-end;

	& ${OptionColumn} {
		width:180px;
	}
`;

export const OptionsContainer = styled.div`
	width:100%;
`;