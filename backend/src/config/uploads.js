const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const {slugify} = require('../utilities');

const destination = (company_name) => {
	const company_folder = slugify(company_name);

	const uploads_path = path.resolve(__dirname, '..', '..', 'uploads');
	if (!fs.existsSync(uploads_path)) fs.mkdirSync(uploads_path);

	const company_path = path.resolve(__dirname, '..', '..', 'uploads', company_folder);
	if (!fs.existsSync(company_path)) fs.mkdirSync(company_path);

	return company_path;
}

const newFileName = (filename) => {
	const hash = crypto.randomBytes(16);
	const new_name = `${hash.toString("hex")}-${filename}`;

	return new_name;
}

const createFilePath = (company_name, filename)=> {
	return path.join(destination(company_name), newFileName(filename));
}

const startUpload = async (readStream, writeStreamPath) => {
	return new Promise((resolve, reject)=>{
		const writeStream = fs.createWriteStream(writeStreamPath);

		readStream.pipe(writeStream)
		.on('finish', (err)=>{
			if (err) reject(err);

			resolve(writeStreamPath);
		});
	});
}

module.exports = {
	destination,
	newFileName,
	createFilePath,
	startUpload,
}