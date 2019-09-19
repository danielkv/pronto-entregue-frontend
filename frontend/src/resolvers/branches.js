import gql from "graphql-tag";

export default {
	Query : {
		
	},
	BranchMeta:{
		action : ()=> {
			return 'update';
		}
	},
	Mutation : {
		selectBranch: async (_, {id}, {client, cache}) => {
			try {
				const {data} = await client.query({query:gql`
					query ($id:ID!) {
						branch (id:$id) {
							id
							name
							active
							last_month_revenue
							createdAt
						}
					}
				`, variables:{id}});
				
				cache.writeData({data:{selectedBranch:data.branch.id}});

				localStorage.setItem('@flakery/selectedBranch', data.branch.id);

				return data.branch;
			} catch (e) {
				console.error(e);
			}
		},
		
	}
}