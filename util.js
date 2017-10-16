'use strict'

function sendMessage (res, status, message) {
	res.status(status).send({
		message: message
	});
}

module.exports = {
	sendMessage
};