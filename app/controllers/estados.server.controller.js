'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Estado = mongoose.model('Estado'),
	_ = require('lodash');

/**
 * Create a Estado
 */
exports.create = function(req, res) {
	var estado = new Estado(req.body);
	estado.user = req.user;

	estado.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estado);
		}
	});
};

/**
 * Show the current Estado
 */
exports.read = function(req, res) {
	res.jsonp(req.estado);
};

/**
 * Update a Estado
 */
exports.update = function(req, res) {
	var estado = req.estado ;

	estado = _.extend(estado , req.body);

	estado.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estado);
		}
	});
};

/**
 * Delete an Estado
 */
exports.delete = function(req, res) {
	var estado = req.estado ;

	estado.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estado);
		}
	});
};

/**
 * List of Estados
 */
exports.list = function(req, res) { 
	Estado.find().sort('-created').populate('user', 'displayName').exec(function(err, estados) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estados);
		}
	});
};

/**
 * Estado middleware
 */
exports.estadoByID = function(req, res, next, id) { 
	Estado.findById(id).populate('user', 'displayName').exec(function(err, estado) {
		if (err) return next(err);
		if (! estado) return next(new Error('Failed to load Estado ' + id));
		req.estado = estado ;
		next();
	});
};

/**
 * Estado authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.estado.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
