const Users = require('../model/users');

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

module.exports = {
	create,
}