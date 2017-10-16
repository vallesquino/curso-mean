'user strict'

var express = require('express'),
	UserController = require('../controllers/user'),
	api = express.Router(),
	md_auth = require('../middlewares/autenticated'),
	multipart = require('connect-multiparty'),
	md_upload = multipart({uploadDir: './uploads/users'});

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;