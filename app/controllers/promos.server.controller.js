'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Promo = mongoose.model('Promo'),
	_ = require('lodash');

/**
 * Create a Promo
 */
exports.create = function(req, res) {

	var promo = new Promo(req.body);
	promo.user = req.user;


	promo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Promo.populate(promo, 'negocio', function (err, promo){
				if (err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				console.log(promo);
				res.jsonp(promo);
			});

		}
	});
};

/**
 * Show the current Promo
 */
exports.read = function(req, res) {
	res.jsonp(req.promo);
};

/**
 * Update a Promo
 */
exports.update = function(req, res) {
	var promo = req.promo ;

	promo = _.extend(promo , req.body);

	promo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(promo);
		}
	});
};

/**
 * Delete an Promo
 */
exports.delete = function(req, res) {
	var promo = req.promo ;

	promo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(promo);
		}
	});
};

/**
 * List of Promos
 */
exports.list = function(req, res) { 


	var query = {};
	if (req.headers.ciudad)
		query = {ciudad:req.headers.ciudad};

	Promo.find(query).sort('-created').populate('user', 'displayName').populate('negocio').exec(function(err, promos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(promos);
		}
	});
};


exports.negocioList = function(req, res){
	Promo.find({negocio : req.params.negocioId}).populate('negocio').exec(function (err,promos){
		if (err){
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		}else{

			res.jsonp(promos);
		}

	});
};

/**
 * Promo middleware
 */
exports.promoByID = function(req, res, next, id) { 
	Promo.findById(id).populate('user', 'displayName').exec(function(err, promo) {
		if (err) return next(err);
		if (! promo) return next(new Error('Failed to load Promo ' + id));
		req.promo = promo ;
		next();
	});
};

/**
 * Promo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.promo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
