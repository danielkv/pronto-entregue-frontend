const Users = require('../model/users');
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
		active:Boolean!
		created_at:String!
		updated_at:String!
		metas:[UserMeta]!
		companies:[Company]!
		branches:[Branch]!
		branch_relation:BranchRelation!
	}

	type Login {
		user:User!
		token:String!
	}

	type Mutation {
		login (email:String!, password:String!): Login!
	}

`;

module.exports.resolvers = {
	Query : {
		users : (parent, args, ctx) => {
			return Users.findAll();
		}
	},
	Mutation : {
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