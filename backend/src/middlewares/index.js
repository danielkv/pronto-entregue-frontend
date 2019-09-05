const {AuthenticationError} = require('apollo-server');
const Users = require('../model/users');

/**
 * Faz autenticação de usuário e insere no
 * objeto de requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function authenticate (authorization) {
	if (!authorization) return null;

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

		return {...user_found.get(), permissions: [user_found.role]};
	});
}

/**
 * Faz a seleção da empresa e das permissões para empresa
 * para os próximos middlewares e insere no object de requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function selecCompany (req, res, next) {
	if (!req.headers.company_id) throw new Error('Empresa não selecionada');
	
	const {company_id} = req.headers;

	Companies.findOne({where:{id:company_id}})
	.then(async (company_found)=>{
		if (!company_found) throw new Error('Empresa selecionada não foi encontrada');
		if (!company_found.active) throw new Error('Essa empresa não está ativa');

		req.company = company_found;
		next();
		return null
	}).catch(next);
}

/**
 * Faz a seleção da filial e insere no objeto de requisição
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function selectBranch (req, res, next) {
	if (!(req.company instanceof Companies)) throw new Error('Empresa não encontrada');
	if (!req.headers.branch_id) throw new Error('Filial não selecionada');
	
	const {company} = req;
	const {branch_id} = req.headers;

	company.getBranches({where:{id:branch_id}})
	.then(async (branches_found)=>{
		if (!branches_found.length) throw new Error('Filial selecionada não foi encontrada');
		
		const branch_found = branches_found[0];
		if (!branch_found.active) throw new Error('Essa filial não está ativa');

		req.branch = branch_found;
		next();
		return null;
	}).catch(next);
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
	selecCompany,
	selectBranch,
	permit,
}