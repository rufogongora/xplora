'use strict';

//Setting up route
angular.module('estados').config(['$stateProvider',
	function($stateProvider) {
		// Estados state routing
		$stateProvider.
		state('listEstados', {
			url: '/estados',
			templateUrl: 'modules/estados/views/list-estados.client.view.html'
		}).
		state('createEstado', {
			url: '/estados/create',
			templateUrl: 'modules/estados/views/create-estado.client.view.html'
		}).
		state('viewEstado', {
			url: '/estados/:estadoId',
			templateUrl: 'modules/estados/views/view-estado.client.view.html'
		}).
		state('editEstado', {
			url: '/estados/:estadoId/edit',
			templateUrl: 'modules/estados/views/edit-estado.client.view.html'
		});
	}
]);