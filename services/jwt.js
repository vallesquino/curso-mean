'use strict'

var jwt = require('jwt-simple'),
	moment = require('moment'),
	secret = 'secret_key';

exports.createToken = function (user) {
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix,
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);
};