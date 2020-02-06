import gql from 'graphql-tag';

export const LOAD_USER_CREDIT_HISTORY = gql`
	query LoadUserCreditHistory ($id: ID!, $pagination: Pagination) {
		user (id: $id) {
			id
			creditBalance
			countCreditHistory
			creditHistory (pagination: $pagination) {
				id
				history
				value
				createdAt
			}
		}
	}
`;
export const CREATE_CREDIT_HISTORY = gql`
	mutation CreateCreditHistory ($userId: ID!, $data: CreditHistoryInput!) {
		createCreditHistory(userId: $userId, data: $data) {
			id
			history
			value
			createdAt
		}
	}
`;