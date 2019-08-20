const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const BranchesMeta = require('../model/branches_meta');

const company = {
	name:"Copeiro hamburge1r",
	display_name:"Copeiro hamburguer111",
	active:true,
	metas:[
		{
			meta_type: "phone",
			meta_value: "48 99999 0000"
		},
		{
			meta_type: "document",
			meta_value:"00.000.000/0000-00"
			
		}
	]
}
const user = {
	first_name:"Diego",
	last_name:"Alves",
	email:"diego@gmail.com",
	password:"123456",
	role:'adm',
	metas:[
		{
			meta_value:"000.000.000-00",
			meta_type:"document"
		}
	]
}

const user1 = {
	first_name:"Natalia",
	last_name:"Regina",
	email:"nrolegario@gmail.com",
	password:"123456",
	active:true,
	metas:[
		{
			meta_value:"000.000.000-00",
			meta_type:"document"
		},
		{
			meta_value:"4898754686",
			meta_type:"phone"
		}
	]
}

const branch = {
	name:"Copeiro Sombrio",
	metas:[
		{
			meta_type: "document",
			meta_value:"00.000.000/0000-00"
		}
	]
}

Promise.all([
	Companies.create(company, {include:[CompaniesMeta]}),
	Users.create(user, {include:[UsersMeta]}),
])
.then (async ([company, user])=>{
	await company.addUser(user);
	return {company, user};
})
.then(async (result)=>{
	const created_branch = await result.company.createBranch(branch, {include:[BranchesMeta]});

	return {...result, branch: created_branch};
})
.then(async (result)=>{
	const new_user = await Users.create(user1, {include:[UsersMeta]});
	await result.company.addUser(new_user);
	await result.branch.addUser(new_user, {through:{role_id:2}});
	return result;
})