const ProductsCagetories = require('../model/products_categories')
const uploads = require('../config/uploads');
const {gql} = require('apollo-server');

module.exports.typeDefs = gql`
	type Category {
		id:ID!
		name:String!
		active:Boolean!
		image:String!
		order:Int!
		created_at:String!
		updated_at:String!
		products:[Product]!
	}

	input CategoryInput {
		name:String
		file:Upload
		active:Boolean
		order:Int
	}

	extend type Query {
		category(id:ID!): Category!
	}

	extend type Mutation {
		createCategory(data:CategoryInput!):Category! @hasRole(permission:"products_edit", scope:"adm")
		updateCategory(id:ID!, data:CategoryInput!):Category! @hasRole(permission:"products_edit", scope:"adm")
	}
`;

module.exports.resolvers = {
	Mutation: {
		createCategory : async (parent, {data}, ctx) => {
			const { stream, filename, mimetype, encoding } = await data.file;
			
			const filepath = uploads.createFilePath(ctx.company.name, filename);
			const file_uploaded = await uploads.startUpload(stream, filepath);

			data.image = file_uploaded;

			return ctx.branch.createCategory(data);
		},
		updateCategory : async (parent, {id, data}, ctx) => {
			if (data.file) {
				const { stream, filename, mimetype, encoding } = await data.file;
				
				const filepath = uploads.createFilePath(ctx.company.name, filename);
				const file_uploaded = await uploads.startUpload(stream, filepath);

				data.image = file_uploaded;
			}

			return ctx.branch.getCategories({where:{id}})
			.then (([category])=>{
				if (!category) throw new Error('Categoria não encontrada');

				return category.update(data);
			})
		},
	},
	Query : {
		category: (parent, {id}, ctx) => {
			return ProductsCagetories.findByPk(id)
			.then(category => {
				if (!category) throw new Error('Categoria não encontrada');
				return category;
			})
		},
	},
	Category : {
		products: (parent) => {
			return parent.getProducts();
		}
	}
}