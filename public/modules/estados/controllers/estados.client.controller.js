'use strict';

// Estados controller
angular.module('estados').controller('EstadosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Estados',
	function($scope, $stateParams, $location, Authentication, Estados) {
		$scope.authentication = Authentication;

		// Create new Estado
		$scope.create = function() {
			// Create new Estado object
			var estado = new Estados ({
				name: this.name
			});

			// Redirect after save
			estado.$save(function(response) {
				$location.path('estados/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Estado
		$scope.remove = function(estado) {
			if ( estado ) { 
				estado.$remove();

				for (var i in $scope.estados) {
					if ($scope.estados [i] === estado) {
						$scope.estados.splice(i, 1);
					}
				}
			} else {
				$scope.estado.$remove(function() {
					$location.path('estados');
				});
			}
		};

		// Update existing Estado
		$scope.update = function() {
			var estado = $scope.estado;

			estado.$update(function() {
				$location.path('estados/' + estado._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Estados
		$scope.find = function() {
			$scope.estados = Estados.query();
		};

		// Find existing Estado
		$scope.findOne = function() {
			$scope.estado = Estados.get({ 
				estadoId: $stateParams.estadoId
			});
		};
	}
]);