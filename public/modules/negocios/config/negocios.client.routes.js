'use strict';

//Setting up route
angular.module('negocios').config(['$stateProvider',
	function($stateProvider) {
		// Negocios state routing
		$stateProvider.
		state('listNegocios', {
			url: '/negocios',
			templateUrl: 'modules/negocios/views/list-negocios.client.view.html'
		}).
		state('createNegocio', {
			url: '/negocios/create',
			templateUrl: 'modules/negocios/views/create-negocio.client.view.html'
		}).
		state('viewNegocio', {
			url: '/negocios/:negocioId',
			templateUrl: 'modules/negocios/views/view-negocio.client.view.html'
		}).
		state('editNegocio', {
			url: '/negocios/:negocioId/edit',
			templateUrl: 'modules/negocios/views/edit-negocio.client.view.html'
		});
	}
]);