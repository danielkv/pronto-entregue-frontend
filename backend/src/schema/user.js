const sequelize = require('../services/connection');
const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const Roles = require('../model/roles');
const {salt} = require('../utilities');
const jwt = require('jsonwebtoken');
//const Notifications = require('../notifications');
//const sequelize = require('../services/connection');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type UserMeta {
		id:ID!
		meta_type:String!
		meta_value:String!
		created_at:String!
	}

	type BranchRelation {
		active:Boolean!
		role: Role!
	}

	type User {
		id:ID!
		first_name:String!
		last_name:String!
		email:String!
		role:String!
		active:Boolean!
		created_at:String!
		updated_at:String!
		metas:[UserMeta]!
		companies:[Company]!
		branches:[Branch]!
		branch_relation:BranchRelation!
	}

	input UserInput {
		first_name:String
		last_name:String
		password:String
		email:String
		active:Boolean
		metas:[UserMetaInput]
	}

	input UserMetaInput {
		id:ID
		action:String! #create | update | delete
		meta_type:String
		meta_value:String
	}

	type Login {
		user:User!
		token:String!
	}

	type Mutation {
		login (email:String!, password:String!): Login!
		createUser (data:UserInput!): User! @hasRole(permission:"users_edit", scope:"adm")
		updateUser (id:ID!, data:UserInput!): User! @hasRole(permission:"users_edit", scope:"adm")
		setUserRole (id:ID!, role_id:ID!):User! @hasRole(permission:"adm")
		setUserScopeRole (id:ID!, role:String!):User! @hasRole(permission:"adm")
	}

	extend type Query {
		user(id:ID!): User!
	}

`;

module.exports.resolvers = {
	Query : {
		users : (parent, args, ctx) => {
			return Users.findAll();
		},
		user:(parent, {id}, ctx) => {
			return Users.findByPk(id)
			.then(user => {
				if (!user) throw new Error('Usuário não encontrada');

				return user;
			});
		}
	},
	Mutation : {
		createUser: (parent, {data}, ctx) => {
			return sequelize.transaction(transaction => {
				return Users.create(data, {include:[UsersMeta], transaction});
			})
		},
		updateUser: (parent, {id, data}, ctx) => {
			return sequelize.transaction(transaction => {
				return Users.findByPk(id)
				.then(user=>{
					if (!user) throw new Error('Usuário não encontrada');

					return user.update(data, { fields: ['first_name', 'last_name', 'password', 'active'], transaction })
				})
				.then(async (user_updated) => {
					if (data.metas) {
						await UsersMeta.updateAll(data.metas, user_updated, transaction);
					}
					return user_updated;
				})
			})
		},
		setUserScopeRole : (parent, {id, role}, ctx) => {
			return ctx.company.getUsers({where:{id}})
			.then(async ([user])=>{
				if (!user) throw new Error('Usuário não encontrada');

				const user_updated = await user.update({role});

				return user_updated;
			});
		},
		setUserRole : (parent, {id, role_id}, ctx) => {
			return ctx.branch.getUsers({where:{id}})
			.then(async ([user])=>{
				if (!user || !user.branch_relation) throw new Error('Usuário não encontrada');
				const role = await Roles.findByPk(role_id);
				if (!role) throw new Error('Função não encontrada');

				await user.branch_relation.setRole(role);
				
				return user;
			});
		},
		/*
		* Autoriza usuário retornando o token com dados,
		* caso autenticação falhe, 'arremessa' um erro
		* 
		*/
		login : (parent, {email, password}, ctx) => {
			return Users.findOne({
				where : {email},
			})
			.then ((user_found)=>{
				//Verifica se encontrou usuário
				if (!user_found) throw new Error('Usuário não encotrado');
		
				//gera token com senha recebidos e salt encontrado e verifica se token salvo é igual
				const salted = salt(password, user_found.salt);
				if (user_found.password != salted.password) throw new Error('Senha incorreta');
				
				//Gera webtoken com id e email
				const token = jwt.sign({
					id: user_found.id,
					email: user_found.email,
				}, process.env.SECRET);
				
				//Retira campos para retornar usuário
				const authorized = user_found.get();
		
				return {
					token,
					user:authorized,
				};
			});
		}
	},
	User: {
		metas: (parent, args, ctx) => {
			return parent.getMetas();
		},
		companies: (parent, args, ctx) => {
			return parent.getCompanies();
		},
		branches: (parent, args, ctx) => {
			return parent.getBranches();
		},
		branch_relation: (parent, args, ctx) => {
			if (!parent.branches_users) throw new Error('Nenhum usuário selecionado');
			return parent.branches_users.getRole()
			.then(role => {
				return {
					role,
					active:parent.branches_users.active
				}
			})
		},
	}
}