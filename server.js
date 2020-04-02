const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

function forceSecure(req, res, next) {
	console.log(req.header('x-forwarded-proto'));

	//Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
	if (req.header('x-forwarded-proto') === 'https' || req.hostname === 'localhost') {
		//Serve Angular App by passing control to the next middleware
		next();
	} else {
		//Redirect if not HTTP with original request URL
		res.redirect('https://' + req.hostname + req.url, 301);
	}
}

app.use(forceSecure);

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