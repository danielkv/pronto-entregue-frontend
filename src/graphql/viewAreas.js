import gql from "graphql-tag";

export const GET_COMPANY_VIEW_AREAS = gql`
	query GetViewAreas ($id: ID!) {
		company (id: $id) {
			id
			viewAreas {
				id
				name
				radius
				center
			}
			address {
				location
			}
		}
	}
`;

export const REMOVE_VIEW_AREA = gql`
	mutation RemoveViewArea ($id: ID!) {
		removeViewArea (id: $id) {
			id
			name
		}
	}
`;

export const MODIFY_VIEW_AREA = gql`
	mutation ModifyViewArea ($data:[ViewAreaInput]!) {
		modifyViewAreas (data:$data) {
			id
			name
		}
	}
`;