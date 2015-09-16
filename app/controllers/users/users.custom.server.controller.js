'use strict';

var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

exports.like = function(req, res){
	
	var negocio = req.body.negocio;
	var user = req.user;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.user);
		var likes = user.likes;
		var index = likes.indexOf(negocio._id);

		if (index < 0)
		{
			user.likes.push(negocio._id);	
		}
		else
		{
			user.likes.splice(index, 1);
		}

		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};


exports.canCreate = function(req, res, next) {
	User.findById(req.user.id).exec(function (err, user){
		if (!err){
			if (user){
				if (user.roles.indexOf('admin') >= 0)
					next();
				else
					res.status(400).send({
						message: 'User is not able to create this'
					});
			}
		}
	});
};
