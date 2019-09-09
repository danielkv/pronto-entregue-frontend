const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de locais de entrega
 */

class ShippingAreas extends Sequelize.Model {};
ShippingAreas.init({
	name: {
		type: Sequelize.STRING,
		allowNull:false,
		validate : {
			notEmpty:{msg:'Você deve definir um nome para o local de entrega'},
			notNull:{msg:'Você deve definir um nome para o local de entrega'},
		}
	},
	type: {
		type: Sequelize.STRING,
		allowNull:false,
		validate: {
			notEmpty:{msg:'O tipo do local de entrega não pode ser vazio'},
			notNull:{msg:'O tipo do local de entrega não pode ser vazio'},
			isIn: {
				args: [['single', 'joker', 'set']],
				msg:'O tipo local de entrega é inválido',
			}
		}
	},
	zipcodes: {
		type: Sequelize.STRING,
		allowNull:false,
		validate : {
			notEmpty:{msg:'Você deve definir os CEps para o local de entrega'},
			notNull:{msg:'Você deve definir os CEPs para o local de entrega'},
		}
	},
	price: {
		type: Sequelize.DECIMAL(10,2),
		defaultValue: 0
	},
}, {modelName:'shipping_areas', underscored:true, sequelize, name:{singular:'ShippingArea', plural:'ShippingAreas'}});

module.exports = ShippingAreas;