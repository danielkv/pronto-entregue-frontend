const sequelize = require('../services/connection');
const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Users = require('../model/users');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type CompanyMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		createdAt:String! @dateTime
	}

	type Company {
		id:ID!
		name:String!
		display_name:String!
		active:Boolean!
		createdAt:String! @dateTime
		updatedAt:String! @dateTime
		metas:[CompanyMeta]!
		branches:[Branch]!
		last_month_revenue:Float!
	}
	
	input CompanyMetaInput {
		id:ID
		action:String! #create | update | delete
		meta_type:String
		meta_value:String
	}

	input CompanyInput {
		name:String
		display_name:String
		active:Boolean
		metas:[CompanyMetaInput]
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
			return sequelize.transaction(transaction => {
				return Companies.create(data, {include:[CompaniesMeta], transaction})
			})
		},
		updateCompany: (parent, {id, data}, ctx) => {
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
		branches: (parent, args, ctx, info) => {
			if (!parent.company_relation) return parent.getBranches();
			
			return Users.findByPk(parent.company_relation.get('user_id'))
			.then(user=>{
				//se Usuário for master pode buscar todas as filiais mesmo desativadas
				if (user.get('role') === 'master') return parent.getBranches({where:{company_id:parent.get('id')}});
				
				//se Usuário for adm pode buscar todas as filiais ativas
				if (user.get('role') === 'adm') return parent.getBranches({where:{company_id:parent.get('id')}});

				//caso chegue aqui usuário verá a lista de filiais que estão ativas e estão vinculadas a ele
				return user.getBranches({where:{active:true, company_id:parent.get('id')}, through:{where:{active:true}}})
			});
		},
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
		last_month_revenue: (parent, args, ctx) => {
			return 0;
		},
	}
}