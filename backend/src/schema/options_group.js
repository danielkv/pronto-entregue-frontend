const {gql} = require('apollo-server');
const Products = require('../model/products');
const ProductsCategories = require('../model/products_categories');
const Branches = require('../model/branches');
const OptionsGroups = require('../model/options_groups');
const Op = require('sequelize').Op;

module.exports.typeDefs = gql`
	type OptionsGroup {
		id:ID!
		name:String!
		type:String!
		order:Int!
		min_select:Int!
		max_select:Int!
		active:Boolean!
		createdAt:String!
		updatedAt:String!
		product:Product!
		options:[Option]!
		options_qty:Int!
		max_select_restrained_by:OptionsGroup
	}

	extend type Query {
		searchOptionsGroups(search:String!):[OptionsGroup]! @hasRole(permission:"products_edit", scope:"adm")
	}
`;

module.exports.resolvers = {
	Query : {
		searchOptionsGroups: (parent, {search}, ctx) => {
			return OptionsGroups.findAll({
				where:{name:{[Op.like]:`%${search}%`}, [`$product->category->branch.company_id$`]:ctx.company.get('id')},
				include:[{
					model: Products,
					include: [{
						model:ProductsCategories,
						include:[Branches]
					}]
				}]
			});
		},
	},
	OptionsGroup: {
		options: (parent, args, ctx) => {
			return parent.getOptions({order:[['order', 'ASC']]});
		},
		options_qty: (parent, args, ctx) => {
			return parent.getOptions()
			.then(options=>{
				return options.length;
			})
		},
		max_select_restrained_by: (parent, args, ctx) => {
			return parent.getMaxSelectionRestriction();
		},
		product : (parent) => {
			return parent.getProduct();
		},
	}
}