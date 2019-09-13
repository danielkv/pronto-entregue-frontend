import gql from "graphql-tag";
import { GET_USER_COMPANY } from "../graphql/companies";
import { SELECT_BRANCH } from "../graphql/branches";

export default {
	Query : {
		userCompany: (parent, {id}, {client, cache, getCacheKey}) => {

			const frag = cache.readFragment({
				id: getCacheKey({__typename:'Company', id}),
				fragment : gql`
					fragment userCompany on Company {
						id
						name
						display_name
						branches {
							id
							name
						}
					}
				`
			});

			return frag
		},
	},
	CompanyMeta:{
		action : ()=> {
			return 'update';
		}
	},
	Mutation : {
		selectCompany: async (_, {id}, {client, cache}) => {
			try {

				const {data} = await client.query({query:GET_USER_COMPANY, variables:{id}});

				//define empresa selecionada e filiais selecionaveis
				cache.writeData({data:{
					selectedCompany:data.userCompany,
					userBranches:data.userCompany.branches
				}});

				const selectedBranch = data.userCompany.branches[0].id;

				await client.mutate({mutation:SELECT_BRANCH, variables:{id:selectedBranch}});
				
				return data.userCompany;
			} catch (e) {
				console.error(e);
			}
		},
	}
}