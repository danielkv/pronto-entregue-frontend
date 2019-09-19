import gql from "graphql-tag";
import { SELECT_BRANCH } from "../graphql/branches";

export default {
	CompanyMeta:{
		action : ()=> {
			return 'update';
		}
	},
	Mutation : {
		selectCompany: async (_, {id}, {client, cache}) => {
			try {
				//carrega, do cliente, a empresa selecionada
				const {data} = await client.query({query:gql`
					query ($id:ID!){
						company(id:$id) {
							id
							display_name
							name
							branches {
								id
								name
								active
								last_month_revenue
								createdAt
							}
						}
					}
				`, variables:{id}});
				
				if (!data) new Error('Empresa não encontrada');

				//define empresa selecionada e filiais selecionaveis
				cache.writeData({data:{
					selectedCompany:data.company.id,
					selectedBranch:'',
					userBranches:data.company.branches
				}});

				localStorage.setItem('@flakery/selectedCompany', data.company.id);

				//seleciona a primeira filial
				const selectedBranch = data.company.branches.length ? data.company.branches[0].id : 0;
				await client.mutate({mutation:SELECT_BRANCH, variables:{id:selectedBranch}});
				
				return data.userCompany;
			} catch (e) {
				console.error(e);
			}
		},
	}
}