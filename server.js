const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

function forceSecure(req, res, next) {
	//Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
	if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
		//Serve Angular App by passing control to the next middleware
		next();
	} else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
		//Redirect if not HTTP with original request URL
		res.redirect('https://' + req.hostname + req.url);
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