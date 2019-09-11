import gql from "graphql-tag";

/**
 * Carrega todas infomações ao acessar
 * 
 * companies, branches, 
 */
export const LOAD_INITIAL_DATA = gql`
	query init {
		me {
			id
			companies {
				id
				name
				display_name
				branches {
					id
					name
				}
			}
		}
	}
`;




