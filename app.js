'use strict'

var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

//Routes Load
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//HTTP Headers Config

//Base Routes
app.use('/api', user_routes);

module.exports = app;