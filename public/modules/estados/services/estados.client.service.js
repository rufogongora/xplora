'use strict';

//Estados service used to communicate Estados REST endpoints
angular.module('estados').factory('Estados', ['$resource',
	function($resource) {
		return $resource('estados/:estadoId', { estadoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);