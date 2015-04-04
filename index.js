var tacobot		= require('./app/tacobot');
var express 	= require('express');
	bodyParser 	= require('body-parser'),
	app 		= express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.end('taco!');
});

app.post('/', function (req, res) {

	tacobot.roomEvent(req.body).always(function(message){
        res.json(message);
    });
});

app.listen(8000);
console.log('Listening at http://localhost:8000');

module.exports = app;