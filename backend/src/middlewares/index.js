const {AuthenticationError} = require('apollo-server');
const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const Companies = require('../model/companies');
const Branches = require('../model/branches');

/**
 * Faz autenticação de usuário e insere no contexto
 * 
 * @param {string} authorization => Token
 */

function authenticate (authorization) {
	if (authorization.split(' ')[0] !== 'Bearer') throw new AuthenticationError('Autorização desconhecida'); 
	const {id, email} = jwt.verify(authorization.split(' ')[1], process.env.SECRET, {ignoreExpiration:true});

	return Users.findOne({
		where:{id, email},
		attributes: {exclude:['password', 'salt']}
	})
	.then(async (user_found)=>{
		if (!user_found) throw new AuthenticationError('Usuário não encontrado');
		if (user_found.active != true) throw new AuthenticationError('Usuário não está ativo');

		user_found.permissions = [user_found.role];

		return user_found;
	});
}

/**
 * Faz a seleção da empresa e insere no contexto
 * 
 * @param {*} company_id => ID da empresa
 */

function selectCompany (company_id) {

	return Companies.findOne({where:{id:company_id}})
	.then((company_found)=>{
		if (!company_found) throw new Error('Empresa selecionada não foi encontrada');
		if (!company_found.active) throw new Error('Essa empresa não está ativa');

		return company_found;
	})
}

/**
 * Faz a seleção da filial e insere no contexto]
 * Retorna um erro se filial for filho de empresa ou não estiver ativa
 * 
 * @param {Companies} company => objeto empresa
 * @param {*} branch_id => ID da filial
 */

function selectBranch (company, branch_id) {

	return company.getBranches({where:{id:branch_id}})
	.then(([branch_found])=>{
		if (!branch_found) throw new Error('Filial selecionada não foi encontrada');
		if (!branch_found.active) throw new Error('Essa filial não está ativa');

		return branch_found;
	});
}

/*
 * Middleware para verificar permissão
 * 
 */

function permit(perms, options) {
	return (req, res, next) => {
		if (!req.user) throw new Error('Usuário não autenticado');

		const {user} = req;
		if (options && typeof options.function == 'function' && options.function(req)){next(); return null;}
		if (!user.can(perms, options)) throw new Error('Você não tem permissões para esta ação');

		next();
		return null;
	}
}

module.exports = {
	authenticate,
	selectCompany,
	selectBranch,
	permit,
}