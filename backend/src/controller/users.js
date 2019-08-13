const Users = require('../model/users');
const Roles = require('../model/roles');

function create (req, res) {
	const user_data = req.body;

	Users
	.create(user_data)
	.then((result)=>{
		res.send(result);
	})
	.catch((err)=>{
		res.status(403).send(err);
	});
}

async function authorize (req, res) {
	const {company_id, email, password} = req.body;

	Users.findOne({
		where : {
			company_id,
			email
		},
		include : [{model: Roles, attributes:['name', 'display_name', 'permissions']}]
	})
	.then ((result)=>{
		const authorized = result.authorize(password);
		res.send(authorized);
	})
	.catch((err) => {
		res.status(403).send({name: err.name, message: err.message});
	});

	
	/* let user_exists = await get({email : email}, ['salt']);
	if (user_exists.length != 1) throw {code: 'user_not_found', message:`Usuário não encontrado`};

	user_exists = user_exists[0];
	if (user_exists.active != true) throw {code: 'inactive_user', message:'Usuário inativo'};

	const salted = salt(password, user_exists.salt);

	let user = await get({email : email, password:salted.password});
	if (user.length != 1) throw {code: 'password_incorrect', message:`Senha incorreta`};
	user = user[0];
	
	const token = await jwt.sign({
		id:user.id,
		email:user.email,
	});

	return {
		token,
		...user,
	}; */
}

module.exports = {
	create,
	authorize
}