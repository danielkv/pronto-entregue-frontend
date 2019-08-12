const Companies = require('../model/companies');
const Users = require('../model/users');

/*
 * Middleware para criar empresa e usuário ADM
 */

function create (req, res) {
	const data = req.body;
	
	const user_data = {
		name:			data.user_name,
		email:			data.user_email,
		password:		data.user_password,
		role_id:		1,
	}

	const company_data = {
		name:			data.company_name,
		display_name:	data.company_name,
		document:		data.company_document,
		phone:			data.company_phone,
		email:			data.company_email,
		contact:		data.company_contact,
		contact_phone:	data.company_contact_phone,
		contact_email:	data.company_contact_email,
		users:			[user_data]
	}

	Companies
	.create(company_data, {include:[Users]})
	.then((result)=> {
		res.send(result);
	})
}

function update(req, res) {
	const {company_id} = req.query;
	
	Companies.findByPk(company_id)
	.then((company)=> {
		company.update(req.body)
		.then((result)=>{
			res.send(result);
		})
	})
	.catch((err)=> {
		res.status(403).send(err);
	});
}

module.exports = {
	create,
	update,
}