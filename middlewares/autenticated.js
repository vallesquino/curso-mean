'use strict'

var jwt = require('jwt-simple'),
	moment = require('moment'),
	util = require('../util'),
	secret = 'secret_key';

exports.ensureAuth = function (req, res, next) {
	var token, payload;

	if (!req.headers.autorization) {
		return util.sendMessage(res, 403, 'Request witout autorization header');
	}

	token = req.headers.autorization.replace(/['"]+/g, '');

	try {
		payload = jwt.decode(token, secret);
		if (payload.exp <= moment().unix()) {
			return util.sendMessage(res, 401, 'Token expired');
		}
	} catch (ex) {
		return util.sendMessage(res, 404, 'Token not valid');
	}

	req.user = payload;
	next();
}