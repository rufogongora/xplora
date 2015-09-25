'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var promos = require('../../app/controllers/promos.server.controller');

	// Promos Routes
	app.route('/promos')
		.get(promos.list)
		.post(users.requiresLogin, promos.create);


	app.route('/promos/:negocioId')
		.get(promos.negocioList);
		
	app.route('/promos/:negocioId/:promoId')
		.get(promos.read)
		.put(users.requiresLogin, promos.hasAuthorization, promos.update)
		.delete(users.requiresLogin, promos.hasAuthorization, promos.delete);

	// Finish by binding the Promo middleware
	app.param('promoId', promos.promoByID);
};
