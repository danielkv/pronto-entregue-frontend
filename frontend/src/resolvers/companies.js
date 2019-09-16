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
				//carrega, do cliente, a empresa selecionada
				const {data} = await client.query({query:GET_USER_COMPANY, variables:{id}});

				//carrega, do servidor, as filiais da empresa selecionadas
				const {data:companyData} = await client.query({query:gql`
					query ($id:ID!) {
						company(id:$id) {
							branches {
								id
								name
							}
						}
					}
				`, variables:{id}});
				
				if (!companyData) new Error('Empresa não encontrada');

				//define empresa selecionada e filiais selecionaveis
				cache.writeData({data:{
					selectedCompany:data.userCompany,
					userBranches:companyData.company.branches
				}});

				//seleciona a primeira filial
				const selectedBranch = companyData.company.branches.length ? companyData.company.branches[0].id : 0;
				await client.mutate({mutation:SELECT_BRANCH, variables:{id:selectedBranch}});
				
				return data.userCompany;
			} catch (e) {
				console.error(e);
			}
		},
	}
}