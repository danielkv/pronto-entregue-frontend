import gql from 'graphql-tag';

export const GET_ROLES = gql`
	query GetRoles{
		roles {
			id
			name
			displayName
		}
	}
`;