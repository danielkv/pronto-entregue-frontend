const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de locais de entrega
 */

class ShippingAreas extends Sequelize.Model {};
ShippingAreas.init({
	name: Sequelize.STRING,
	zipcodes: Sequelize.TEXT,
	amount: Sequelize.DECIMAL(10,2),
}, {modelName:'shipping_areas', underscored:true, sequelize});

module.exports = ShippingAreas;