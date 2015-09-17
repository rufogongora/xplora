'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var estados = require('../../app/controllers/estados.server.controller');

	// Estados Routes
	app.route('/estados')
		.get(estados.list)
		.post(estados.create);

	app.route('/estados/:estadoId')
		.get(estados.read)
		.put(users.requiresLogin, estados.hasAuthorization, estados.update)
		.delete(users.requiresLogin, estados.hasAuthorization, estados.delete);

	// Finish by binding the Estado middleware
	app.param('estadoId', estados.estadoByID);
};
