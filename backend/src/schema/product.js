const sequelize = require('../services/connection');
const Products = require('../model/products');
const Options = require('../model/options');
const OptionsGroups = require('../model/options_groups');
const { gql} = require('apollo-server');
const uploads = require('../config/uploads');

module.exports.typeDefs = gql`
	type Product {
		id:ID!
		name:String!
		image:String!
		order:Int!
		type:String!
		price:Float!
		category:Category!
		active:Boolean!
		options_qty:Int!
		createdAt:String! @dateTime
		updatedAt:String! @dateTime
		options_groups:[OptionsGroup]!
	}

	input ProductInput {
		name:String
		file:Upload
		type:String
		price:Float
		active:Boolean
		category_id:ID
		options_groups:[OptionsGroupInput]
	}

	input OptionsGroupInput {
		id:ID
		action:String! #create | update | delete
		name:String
		type:String
		min_select:Int
		max_select:Int
		active:Boolean
		options:[OptionInput]
		max_select_restricted_by:ID
	}

	input OptionInput {
		id:ID
		action:String! #create | update | delete
		name:String
		order:Int
		active:Boolean
		price:Float
		max_select_restrain_other:Int
		item_id:ID
	}

	extend type Query {
		product(id:ID!): Product!
	}

	extend type Mutation {
		createProduct(data:ProductInput!):Product! @hasRole(permission:"users_edit", scope:"adm")
		updateProduct(id:ID!, data:ProductInput!):Product! @hasRole(permission:"users_edit", scope:"adm")
	}
`;

module.exports.resolvers = {
	Mutation: {
		createProduct: async (parent, {data}, ctx) => {
			const { stream, filename, mimetype, encoding } = await data.file;
			
			const filepath = uploads.createFilePath(ctx.company.name, filename);
			const file_uploaded = await uploads.startUpload(stream, filepath);

			data.image = file_uploaded;

			return sequelize.transaction(transaction => {
				return ctx.branch.getCategories({where:{id:data.category_id}})
				.then(async ([category]) => {
					if (!category) throw new Error('Categoria não encontrada');

					const product = await category.createProduct(data, {transaction});

					if (data.options_groups)
						options_groups = await OptionsGroups.updateAll(data.options_groups, product, transaction);
					
					return product;
				})
				
			})
		},
		updateProduct : async (parent, {id, data}, ctx) => {
			if (data.file) {
				const { stream, filename, mimetype, encoding } = await data.file;
				
				const filepath = uploads.createFilePath(ctx.company.name, filename);
				const file_uploaded = await uploads.startUpload(stream, filepath);

				data.image = file_uploaded;
			}

			return sequelize.transaction(transaction => {
				return Products.findByPk(id)
				.then(async (product) => {
					if (!product) throw new Error('Produto não encontrado');
					const product_updated = await product.update(data, {fields:['price', 'order', 'active', 'image', 'type'], transaction});
					
					if (data.category_id) {
						const [category] = await ctx.branch.getCategories({where:{id:data.category_id}})
						if (!category) throw new Error('Categoria não encontrada');

						await product_updated.setCategory(category, {transaction});
					}

					if (data.options_groups)
						options_groups = await OptionsGroups.updateAll(data.options_groups, product, transaction);
					
					return product_updated;
				})
				
			})
		},
	},
	Query : {
		product: (parent, {id}, ctx) => {
			return Products.findByPk(id)
			.then(product => {
				if (!product) throw new Error('Produto não encontrada');
				return product;
			})
		},
	},
	Product: {
		options_qty : (parent, args, ctx) => {
			return Options.count({where:{active:true}, include:[{model:OptionsGroups, where:{product_id:parent.get('id')}}]});
		},
		options_groups: (parent, args, ctx) => {
			return parent.getOptionsGroups();
		},
		category : (parent, args, ctx) => {
			return parent.getCategory();
		},
	}
}