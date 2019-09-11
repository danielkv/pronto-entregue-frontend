import client from "../services/server";
import { SELECT_BRANCH, GET_USER_COMPANY, GET_USER_BRANCH } from "../graphql/companies";
import gql from "graphql-tag";

export default {
	Query : {
		userCompany: (parent, {id}, {cache, getCacheKey}) => {
			return cache.readFragment({
				id: getCacheKey({__typename:'Company', id}),
				fragment : gql`
					fragment Company on userCompanies {
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
		},
		userBranch: (parent, {id}, {cache, getCacheKey}) => {
			return cache.readFragment({
				id: getCacheKey({__typename:'Branch', id}),
				fragment : gql`
					fragment Branch on userBranches {
						id
						name
					}
				`
			});
		}
	},
	Mutation : {
		selectCompany: async (_, {id}, {cache}) => {
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
		selectBranch: async (_, {id}, {cache}) => {
			try {
				const {data} = await client.query({query:GET_USER_BRANCH, variables:{id}});
				
				cache.writeData({data:{selectedBranch:data.userBranch}});

				return data.userBranch;
			} catch (e) {
				console.error(e);
			}
		}
	},
} 