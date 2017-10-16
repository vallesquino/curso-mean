'use strict'

var fs = require('fs'),
	path = require('path'),
	bcrypt = require('bcrypt-nodejs'),
	User = require('../models/user'),
	jwt = require('../services/jwt'),
	util = require('../util');

function saveUser (req, res) {
	var user = new User(),
		params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		if(user.name != null && user.surname != null && user.email != null) {
			// Encrypt password and save data
			bcrypt.hash(params.password, null, null, (err, hash) => {
				user.password = hash;
				//Save User
				user.save((err, userStored) => {
					if(err) {
						util.sendMessage(res, 200, 'Error saving User');
					} else if(!userStored) {
						util.sendMessage(res, 400, 'User no registered');
					} else {
						res.status(200).send({user: userStored});
					}
				});
			})
		}else {
			util.sendMessage(res, 200, 'Fill all the fields');
		}
	} else {
		util.sendMessage(res, 200, 'Introduce your password');
	}
}

function loginUser (req, res) {
	var params = req.body,
		email = params.email,
		password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err) {
			util.sendMessage(res, 500, 'Error in the request');
		} else if (!user) {
			util.sendMessage(res, 404, 'User doesn\'t exist');
		} else {
			//Check password
			bcrypt.compare(password, user.password, (err, check) => {
				if (check) { //Return user data
					if (params.gethash) {
						//Return a jwt token
						res.status(200).send({token: jwt.createToken(user)});
					} else {
						res.status(200).send({user});
					}
				} else {
					util.sendMessage(res, 404, 'User cannot be logged');
				}
			});
		}
	});
}

function updateUser (req, res){
	var userId = req.params.id,
		update = req.body;

	if(update.password){
		// Encrypt password first 
		bcrypt.hash(update.password, null, null, (err, hash) => {
			update.password = hash;
			findUserByIdAndUpdate(res, userId, update);
		});
	} else {
		findUserByIdAndUpdate(res, userId, update);
	}		
}

function findUserByIdAndUpdate(res, userId, update){
	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			util.sendMessage(res, 500, 'Error updating user');
		} else if(!userUpdated){
			util.sendMessage(res, 404, 'User cannot be updated');
		} else {
			res.status(200).send({
				user: userUpdated
			});
		}
	});
}

function uploadImage (req, res) {
	var userId = req.params.id,
		fileName = 'No uploaded ...';

	if (req.files){
		var filePath = req.files.image.path,
			fileSplit = filePath.split('/'),
			fileName = fileSplit[2],
			extSplit = fileName.split('\.'),
			fileExt = extSplit[1];

		if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
			findUserByIdAndUpdate(res, userId, {image: fileName});
		} else {
			util.sendMessage(res, 200, 'No valid extension');
		}
	} else {
		util.sendMessage(res, 200, 'No image uploaded');
	}
}

function getImageFile (req, res) {
	var imageFile = req.params.imageFile,
		pathFile = './uploads/users/' + imageFile;

	fs.access(pathFile, (err) => {
		if (!err) {
			res.sendFile(path.resolve(pathFile));
		} else {
			util.sendMessage(res, 200, 'Image no exist');
		}
	});
}

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};