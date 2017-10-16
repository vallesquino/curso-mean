'use strict'

var mongoose = require('mongoose'),
	app = require('./app'),
	port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso-mean', (err, res) => {
	if(err){
		throw err;
	} else {
		console.log("DB connected ...");
		app.listen(port, function(){
			console.log("API rest listening on http://localhost:" + port);
		});
	}
});