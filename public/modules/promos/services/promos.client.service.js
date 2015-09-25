'use strict';

//Promos service used to communicate Promos REST endpoints
angular.module('promos').factory('Promos', ['$resource',
	function($resource) {
		return $resource('promos/:promoId', { promoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);