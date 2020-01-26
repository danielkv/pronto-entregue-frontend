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

export const LOAD_CAMPAIGN = gql`
	query CreateCampaign ($id: ID!) {
		campaign (id: $id) {
			id
			name
			image
			description
			chargeCompany
			acceptOtherCampaign
			startsAt
			expiresAt
			masterOnly
			type
			valueType
			value
			createdAt
			active

			companies {
				id
				name
				displayName
			}
			products {
				id
				name
				image
			}
			users {
				id
				fullName
				email
			}
		}
	}
`;

export const UPDATE_CAMPAIGN = gql`
	mutation UpdateCampaign ($id: ID!, $data: CampaignInput!) {
		updateCampaign (id: $id, data: $data) {
			id
			name
			image
			startsAt
			expiresAt
			masterOnly
			type
			valueType
			value
			createdAt
			active
		}
	}
`;

export const GET_CAMPAIGNS = gql`
	query GetCampaigns ($filter: Filter, $pagination: Pagination) {
		countCampaigns(filter: $filter)
		campaigns (filter: $filter, pagination: $pagination) {
			id
			name
			image
			startsAt
			expiresAt
			masterOnly
			type
			valueType
			value
			createdAt
			active
		}
	}
`;