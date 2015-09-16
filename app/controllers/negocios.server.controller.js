'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Negocio = mongoose.model('Negocio'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Negocio
 */
exports.create = function(req, res) {
	var negocio = new Negocio(req.body);

	negocio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(negocio);
		}
	});
};

/**
 * Show the current Negocio
 */
exports.read = function(req, res) {
	res.jsonp(req.negocio);
};

/**
 * Update a Negocio
 */
exports.update = function(req, res) {
	var negocio = req.negocio ;

	negocio = _.extend(negocio , req.body);

	negocio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(negocio);
		}
	});
};

/**
 * Delete an Negocio
 */
exports.delete = function(req, res) {
	var negocio = req.negocio ;

	negocio.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(negocio);
		}
	});
};

/**
 * List of Negocios
 */
exports.list = function(req, res) { 
/*	Negocio.find().sort('-created').populate('user', 'displayName').exec(function(err, negocios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(negocios);
		}
	});*/

	Negocio.find({categoria:req.params.categoryId}).exec(function (err, negocios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(negocios);
		}
	});
};


exports.like = function(req, res, next){

	var negocio = req.body.negocio;
	var user = req.user;

	if (user) {
		// Merge existing user
		negocio = _.extend(negocio , req.body.negocio);
		var likes = user.likes;
		var index = likes.indexOf(negocio._id);
		var inc = 0;
		if (index < 0)
		{
			inc = 1;
		}
		else
		{
			inc = -1;
		}


		var conditions = { _id : negocio._id},
		update = { $inc : { likes : inc } };

		Negocio.update(conditions, update, function (err){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				next();
			}

		});

/*		negocio.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				next();
			}
		});*/

	}







};
/**
 * Negocio middleware
 */
exports.negocioByID = function(req, res, next, id) { 
	Negocio.findById(id).populate('user', 'displayName').exec(function(err, negocio) {
		if (err) return next(err);
		if (! negocio) return next(new Error('Failed to load Negocio ' + id));
		req.negocio = negocio ;
		next();
	});
};

/**
 * Negocio authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.negocio.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


