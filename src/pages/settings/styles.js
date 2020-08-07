import { Typography } from '@material-ui/core';

import styled from 'styled-components';

export const ConfigSectionTitle = styled(Typography).attrs({ variant: 'text' })`
	display: block;
	text-transform: uppercase;
	font-size: 18px;
	font-weight: bold !important;
	padding-bottom: 6px;
	margin-bottom: 15px !important;
	border-bottom: 1px solid #ccc;
`;

export const ConfigSectionContent = styled.div`
	
`;

export const ConfigSection = styled.section`
	margin: 15px 0;	
	background-color: #fcfcfc;
	border-radius: 10px;
	padding: 20px;

	& ${ConfigSectionContent}:not(:last-child) {
		margin-bottom: 20px;
	}
`;