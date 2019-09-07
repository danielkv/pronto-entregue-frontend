require('dotenv').config();
require('./services/setup'); //Configura banco de dados e relações das tabelas
const { ApolloServer } = require('apollo-server');
const mid = require('./middlewares');

//schema
const schema = require('./schema/_index');

//Configuração de schema e inserção de contexto
const server = new ApolloServer({
	schema,
	//introspection:true,
	context : async ({req}) => {
		if (req.headers['x-apollo-tracing']) return {};

		const {authorization, company_id, branch_id} = req.headers;
		let user = null, company = null, branch = null;

		if (authorization) user = await mid.authenticate(authorization);
		if (company_id) company = await mid.selectCompany(company_id, user);
		if (branch_id) branch = await mid.selectBranch(company, user, branch_id);

		return {
			user,
			company,
			branch,
		}
	},
});

//Ouvir porta
server.listen().then(({url})=> {
	console.log(`Server ready at ${url}`);
});