import gql from "graphql-tag";

export default {
	CompanyMeta: {
		action: ()=> {
			return 'editable';
		}
	},
	Mutation: {
		setSelectCompany: async (_, { id }, { client, cache }) => {
			try {
				//carrega, do cliente, a empresa selecionada
				const { data } = await client.query({
					query: gql`
						query ($id: ID!){
							company(id:$id) {
								id
								displayName
								name
							}
						}
				`, variables: { id }
				});
				
				if (!data) throw new Error('Empresa não encontrada');

				//define empresa selecionada e filiais selecionaveis
				cache.writeData({
					data: {
						selectedCompany: data.company.id,
					}
				});

				localStorage.setItem('@prontoentregue/selectedCompany', data.company.id);
			} catch (e) {
				console.error(e);
			}
		},
	}
}