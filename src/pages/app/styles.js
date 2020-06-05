import styled from 'styled-components';


export const AppsDownloadContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 400px;
	max-width: 90%;
	flex-wrap: wrap;
	text-align:center;
	margin-bottom: 30px;

	a {
		display: block;
		width: 100%;
		height: auto;
		svg {
			box-sizing: border-box;
		}
		img {
			max-width: 100%;
			height: auto;
		}
	}
`;