require('dotenv').config();
require('./services/setup'); //Configura banco de dados e relações das tabelas
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const mid = require('./middlewares');

//express config
const app = express();
const port = process.env.PORT || 4000;

//schema
const schema = require('./schema/_index');

//Configuração de schema e contexto
const server = new ApolloServer({
	schema,
	context : async ({req}) => {

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

//configura rota estática
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

//configura apollo server
server.applyMiddleware({app, path:'/graphql'});

//ouve porta
app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);