const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Users = require('../model/users');

/*
 * Middleware para criar empresa e usuário ADM
 */

function create (req, res) {
	const data = req.body;
	
	const user_data = {
		
	}

	const company_data = {
		name:			data.company_name,
		display_name:	data.company_name,
		users:			[{
			first_name:		data.user_first_name,
			last_name:		data.user_last_name,
			email:			data.user_email,
			password:		data.user_password,
			role_id:		2, // adm
		}],
		companies_meta:	[
			{meta_type: 'document', meta_value: data.company_document},
			{meta_type: 'phone', meta_value: data.company_phone},
			{meta_type: 'email', meta_value: data.company_phone},
			{meta_type: 'contact', meta_value: data.company_contact},
			{meta_type: 'contact_phone', meta_value: data.company_contact_phone},
			{meta_type: 'contact_email', meta_value: data.company_contact_email},
		]
	}

	Companies
	.create(company_data, {include:[Users, CompaniesMeta]})
	.then((result)=> {
		res.send(result);
	})
}

function update(req, res) {
	const {company_id} = req.query;
	
	Companies.findByPk(company_id)
	.then(company=>company.update(req.body))
	.then((result)=>{
		res.send(result);
	})
	.catch((err)=> {
		res.status(403).send(err);
	});
}

module.exports = {
	create,
	update,
}