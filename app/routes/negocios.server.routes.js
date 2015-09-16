'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var negocios = require('../../app/controllers/negocios.server.controller');

	// Negocios Routes
	app.route('/negocios')
		.post(users.requiresLogin, negocios.create);

	app.route('/negocios/:categoryId')
		.get(negocios.list);

	app.route('/negocios/:categoryId/:negocioId')
		.get(negocios.read);

	app.route('/negocios/like')
		.post(users.requiresLogin, negocios.like, users.like);
		
	// Finish by binding the Negocio middleware
	app.param('negocioId', negocios.negocioByID);
};
