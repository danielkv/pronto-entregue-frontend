const sequelize = require('../services/connection');
const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type CompanyMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type Company {
		id:ID!
		name:String!
		display_name:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		metas:[CompanyMeta]!
		branches:[Branch]!
	}
	
	input CompanyMetaInput {
		id:ID!
		action:String! #create | update | delete
		meta_type:String!
		meta_value:String!
	}

	input CompanyInput {
		name:String!
		display_name:String!
		metas:[CompanyMetaInput]!
	}

	extend type Mutation {
		createCompany(data:CompanyInput!):Company! @hasRole(permission:"companies_edit", scope:"adm")
		updateCompany(id:ID!, data:CompanyInput!):Company! @hasRole(permission:"companies_edit", scope:"adm")
	}

	extend type Query {
		company(id:ID!): Company!
	}
`;

module.exports.resolvers = {
	Mutation : {
		createCompany: (parent, {data}, ctx) => {
			//console.log(data)
			return sequelize.transaction(transaction => {
				return Companies.create(data, {include:[CompaniesMeta], transaction})
			})
		},
		updateCompany: (parent, {id, data}, ctx) => {
			//console.log(data)
			return sequelize.transaction(transaction => {
				return Companies.findByPk(id)
				.then(company=>{
					if (!company) throw new Error('Empresa não encontrada');

					return company.update(data, { fields: ['name', 'display_name', 'active'], transaction })
				})
				.then(async (company_updated) => {
					if (data.metas) {
						await CompaniesMeta.updateAll(data.metas, company_updated, transaction);
					}
					return company_updated;
				})
			})
		}
	},
	Query : {
		companies: (parent, args, ctx) => {
			return Companies.findAll();
		},
		company:(parent, {id}, ctx) => {
			return Companies.findByPk(id)
			.then(company => {
				if (!company) throw new Error('Empresa não encontrada');

				return company;
			});
		}
	},
	Company: {
		branches: (parent, args, ctx) => {
			return parent.getBranches();
		},
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
	}
}