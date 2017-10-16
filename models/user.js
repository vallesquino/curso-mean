'use strict'

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	UserSchema = Schema({
		name: String,
		surname: String,
		email: String,
		password: String,
		role: String,
		image: String
	});

module.exports = mongoose.model('User', UserSchema);