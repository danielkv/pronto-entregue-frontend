const sequelize = require('../services/connection');
const Sequelize = require('sequelize');

/*
 * Define modelo (tabela) de metadata para as filiais
 */

class BranchesMeta extends Sequelize.Model {
	static async updateAll(metas, model_instance) {
		const metas_remove = metas.filter(row=>row.id && row.remove===true);
		const metas_create = metas.filter(row=>!row.id && !row.remove);
		const metas_update = metas.filter(row=>row.id && !row.remove);
		
		const [removed, created, updated] = await Promise.all([
			BranchesMeta.destroy({ where: { id: metas_remove.map(r => r.id) } }).then(() => metas_remove),
			Promise.all(metas_create.map(row => model_instance.createMeta(row))),
			Promise.all(metas_update.map(row => BranchesMeta.findByPk(row.id).then((meta) => meta.update(row, {fields:['meta_value']}))))
		]);

		return {
			removed,
			created,
			updated,
		};
	}
};
BranchesMeta.init({
	meta_type: {
		type:Sequelize.STRING,
		comment: 'phone | email | document | business_hours | address | ...',
		set(val) {
			const unique_types = ['document', 'business_hours'];
			if (unique_types.includes(val))
				this.setDataValue('unique', true);
			
			this.setDataValue('meta_type', val);
		},
		validate : {
			async isUnique (value, done) {
				const meta = await BranchesMeta.findOne({ where: { branch_id: this.getDataValue('branch_id'), meta_type: value } });
				const unique = this.getDataValue('unique');
				if (meta) {
					if (meta.unique === true) return done(new Error('Esse metadado já existe, você pode apenas altera-lo'));
					if (unique === true) return done(new Error('Esse metadado deve ser unico, já existem outros metadados desse tipo.'));
				}
				
				return done();
			}
		}
	},
	meta_value: Sequelize.TEXT,
	unique: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
}, {modelName:'branches_meta', underscored:true, sequelize, name:{singular:'meta', plural:'metas'}});

module.exports = BranchesMeta;