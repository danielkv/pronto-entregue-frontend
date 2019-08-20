const conn = require('./connection.js');
require('./relations.js');

const forceSync = false;

if (forceSync) {
	conn.sync({force:true}).then(()=>{
		//Create default rows
		require('./create_defaults');
		require('./dummy_data');
	});
}