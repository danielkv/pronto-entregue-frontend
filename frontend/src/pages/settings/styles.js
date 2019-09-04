import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const MenuLink = styled(Link)`
	display:block;
	padding:20px 23px;
	border-bottom:1px solid #f0f0f0;
	text-decoration:none;
	color:#707070;
	&:hover {
		background-color:#F2F2F2;
	}
	&.selected {
		background-color:#D41450;
		color:white;
	}
`;