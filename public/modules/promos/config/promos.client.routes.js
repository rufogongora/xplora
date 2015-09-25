'use strict';

//Setting up route
angular.module('promos').config(['$stateProvider',
	function($stateProvider) {
		// Promos state routing
		$stateProvider.
		state('listPromos', {
			url: '/promos',
			templateUrl: 'modules/promos/views/list-promos.client.view.html'
		}).
		state('createPromo', {
			url: '/promos/create',
			templateUrl: 'modules/promos/views/create-promo.client.view.html'
		}).
		state('viewPromo', {
			url: '/promos/:promoId',
			templateUrl: 'modules/promos/views/view-promo.client.view.html'
		}).
		state('editPromo', {
			url: '/promos/:promoId/edit',
			templateUrl: 'modules/promos/views/edit-promo.client.view.html'
		});
	}
]);