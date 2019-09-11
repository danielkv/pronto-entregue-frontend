export default {
	Query : {
		hasToken:() => {
			const token = localStorage.getItem('@flakery/userToken');
			if (token) return token;
			return '';
		}
	},
	Mutation : {

	},

}