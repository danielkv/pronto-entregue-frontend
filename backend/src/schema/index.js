const {makeExecutableSchema} = require('apollo-server');
const {merge} = require('lodash');

//types
const typesCompany = require('./types/company');

//resolvers
const resolversCompanies = require('./resolvers/companies');

module.exports = makeExecutableSchema({
	typeDefs : [typesCompany],
	resolvers : merge(resolversCompanies)
})