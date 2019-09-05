require('dotenv').config();
require('./services/setup'); //Configura banco de dados e relações das tabelas
const { ApolloServer } = require('apollo-server');
const mid = require('./middlewares');

const schema = require('./schema');

const server = new ApolloServer({
	schema,
	context : async ({req}) => {
		const {authorization, company_id, branch_id} = req.headers;
		let user = null, company = null, branch = null;

		if (authorization) user = await mid.authenticate(authorization);
		if (company_id) company = await mid.selecCompany(company_id, user);
		if (branch_id) branch = await mid.selectBranch(branch_id, company, user);

		return {
			user,
			company,
			branch,
		}
	},
});

//Atender porta
server.listen().then(({url})=> {
	console.log(`Server ready at ${url}`);
});