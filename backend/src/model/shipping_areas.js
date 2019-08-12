const conn = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de locais de entrega
 */

const ShippingAreas = conn.define('shipping_areas', {
	name: Sequelize.STRING,
	zipcodes: Sequelize.TEXT,
	amount: Sequelize.DECIMAL(10,2),
});

module.exports = ShippingAreas;