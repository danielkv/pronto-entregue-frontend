const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
	if (process.env.SETUP) return res.sendStatus(400)
	return res.send('pong');
});

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, ()=>{
	console.log(port)
});