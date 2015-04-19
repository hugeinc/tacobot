var tacobot     = require('./app/tacobot'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    nconf       = require('nconf'),
    app         = express();

nconf.argv().env();
nconf.file({file: 'config.json'});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// view instanbul test coverage over localhost http://localhost:8000/test-coverage
app.use('/test-coverage', express.static(path.join(__dirname , 'test-coverage')));

app.get('/', function (req, res) {
    res.end('taco!');
});

app.post('/', function (req, res) {
    tacobot.roomEvent(req.body)
        .always(function (message) {
            res.json(message);
        });
});

app.listen(8000);
console.log('Listening at http://localhost:8000');

module.exports = app;