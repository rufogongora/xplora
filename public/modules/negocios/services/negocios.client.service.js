'use strict';

//Negocios service used to communicate Negocios REST endpoints
angular.module('negocios').factory('Negocios', ['$resource',
	function($resource) {
		return $resource('negocios/:negocioId', { negocioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);