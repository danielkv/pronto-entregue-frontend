import gql from "graphql-tag";

export const CREATE_CAMPAIGN = gql`
	mutation CreateCampaign ($data: CampaignInput!) {
		createCampaign (data: $data) {
			id
			name
			image
		}
	}
`;