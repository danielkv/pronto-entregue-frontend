//const { SchemaDirectiveVisitor } = require('graphql-tools');
const Users = require('../../model/users');


module.exports = {
	hasRole: (next, source, {permission}, ctx) => {
		if (!(ctx.user instanceof Users)) throw new Error('Usuário não autenticado')
		
		if (!ctx.user.can(permission))
			throw new Error(`Você não tem permissões para essa ação`);

		return next();
	},
	isAuthenticated: (next, source, args, ctx) => {
		if (!(ctx.user instanceof Users)) throw new Error('Usuário não autenticado')
		
		return next();
	},
}