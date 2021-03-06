'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var negocios = require('../../app/controllers/negocios.server.controller');

	// Negocios Routes
	app.route('/negocios')
		.post(users.requiresLogin, negocios.create)
		.get(users.requiresLogin, negocios.getForUser);

	app.route('/negocios/:categoryId')
		.get(negocios.list);

	app.route('/negocios-pendientes')
		.get(negocios.negociosPendientes);

	app.route('/negocios-unapproved')
		.get(negocios.unapproved);

	app.route('/negocios/:categoryId/:negocioId')
		.get(negocios.read)
		.post(negocios.approve)
		.put(users.requiresLogin, negocios.hasAuthorization, negocios.update);

	app.route('/negocios/like')
		.post(users.requiresLogin, negocios.like, users.like);
		
	// Finish by binding the Negocio middleware
	app.param('negocioId', negocios.negocioByID);
};
