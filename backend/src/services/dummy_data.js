const Companies = require('../model/companies');
const CompaniesMeta = require('../model/companies_meta');
const Users = require('../model/users');
const UsersMeta = require('../model/users_meta');
const BranchesMeta = require('../model/branches_meta');
const Products = require('../model/products');
const ProductsCategories = require('../model/products_categories');

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

const products = [
	{
		name:'Hambúrguer com Calabresa',
		type:'multiple',
		amount: 16.98,
		image : "C:/Users/danie/Documents/GitHub/PizzariaDelivery/backend/uploads/copeiro-hamburge1r/7992a90a930724d8fc01e862dba8ee89-hamburguer-de-siri-stunt-burger-1432825855665_1280x855-1024x684.jpg",
		company_id:1,
	},
	{
		name:'Suco',
		type:'multiple',
		amount: 4.8,
		image : "C:/Users/danie/Documents/GitHub/PizzariaDelivery/backend/uploads/copeiro-hamburge1r/7992a90a930724d8fc01e862dba8ee89-hamburguer-de-siri-stunt-burger-1432825855665_1280x855-1024x684.jpg",
		company_id:1,
	},
	{
		name:'Pizza',
		type:'multiple',
		amount: 55.90,
		image : "C:/Users/danie/Documents/GitHub/PizzariaDelivery/backend/uploads/copeiro-hamburge1r/7992a90a930724d8fc01e862dba8ee89-hamburguer-de-siri-stunt-burger-1432825855665_1280x855-1024x684.jpg",
		company_id:1,
	},
];

const categories = [
	{
		name: 'Hambúrguer',
		image : "C:/Users/danie/Documents/GitHub/PizzariaDelivery/backend/uploads/copeiro-hamburge1r/7992a90a930724d8fc01e862dba8ee89-hamburguer-de-siri-stunt-burger-1432825855665_1280x855-1024x684.jpg",
		branch_id : 1,
	},
	{
		name: 'Sucos',
		image : "C:/Users/danie/Documents/GitHub/PizzariaDelivery/backend/uploads/copeiro-hamburge1r/7992a90a930724d8fc01e862dba8ee89-hamburguer-de-siri-stunt-burger-1432825855665_1280x855-1024x684.jpg",
		branch_id : 1,
	},
	{
		name: 'Lanches',
		image : "C:/Users/danie/Documents/GitHub/PizzariaDelivery/backend/uploads/copeiro-hamburge1r/7992a90a930724d8fc01e862dba8ee89-hamburguer-de-siri-stunt-burger-1432825855665_1280x855-1024x684.jpg",
		branch_id : 1,
	}
];

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
.then (async (result)=>{
	await Products.bulkCreate(products);
	await ProductsCategories.bulkCreate(categories);
	return result;
})