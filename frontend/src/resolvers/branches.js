import gql from "graphql-tag";
import { GET_USER_BRANCH } from "../graphql/branches";

export default {
	Query : {
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
		},
	},
	Mutation : {
		selectBranch: async (_, {id}, {client, cache}) => {
			try {
				const {data} = await client.query({query:GET_USER_BRANCH, variables:{id}});
				
				cache.writeData({data:{selectedBranch:data.userBranch}});

				return data.userBranch;
			} catch (e) {
				console.error(e);
			}
		},
		
	}
}