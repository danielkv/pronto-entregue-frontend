//const { SchemaDirectiveVisitor } = require('graphql-tools');
const Users = require('../../model/users');
const Companies = require('../../model/companies');
const Branches = require('../../model/branches');

module.exports = {
	hasRole: (next, source, {permission, scope}, ctx) => {
		if (!(ctx.user instanceof Users)) throw new Error('Usuário não autenticado');
		if (!(ctx.company instanceof Companies)) throw new Error('Empresa não selecionada');
		if (!(ctx.branch instanceof Branches)) throw new Error('Filial não selecionada');
		
		if (!ctx.user.can(permission, {scope}))
			throw new Error(`Você não tem permissões para essa ação`);

		return next();
	},
	isAuthenticated: (next, source, args, ctx) => {
		if (!(ctx.user instanceof Users)) throw new Error('Usuário não autenticado')
		
		return next();
	},
}