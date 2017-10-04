let express = require('express');
let routes = require('./routes/index');
let path = require('path');
let config = require('./config');
let logger = require('morgan');
let bodyParser = require('body-parser');
let basicAuth = require('basic-auth');

let auth = function(req, res, next){
    let user = basicAuth(req);
    if(user && user.name == "heia-fr" && user.pass == "hum@ntec")
        return next();
    else{
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }
};

let app = express();
app.disable('x-powered-by');
app.use(logger('dev'));
app.use('/client.min.js', express.static(path.join(__dirname, '..', 'src', 'client.min.js')));
app.use('/material.min.css', express.static(path.join(__dirname, '..', 'src', 'material.min.css')));
app.use('/material.min.js', express.static(path.join(__dirname, '..', 'src', 'material.min.js')));
app.use('/styles.css', express.static(path.join(__dirname, '..', 'src', 'styles.css')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/*', auth);
app.use('/*', express.static(path.join(__dirname, '..', 'src', 'index.html')));
app.use('/', auth);
app.use('/', express.static(path.join(__dirname, '..', 'src')));

app.use(express.static(path.join(__dirname, '..', 'src')));

app.listen(config.http.port);
console.log('Server running on port ' + config.http.port);
module.exports = app;