'use strict';

// Negocios controller
angular.module('negocios').controller('NegociosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Negocios',
	function($scope, $stateParams, $location, Authentication, Negocios) {
		$scope.authentication = Authentication;

		// Create new Negocio
		$scope.create = function() {
			// Create new Negocio object
			var negocio = new Negocios ({
				name: this.name
			});

			// Redirect after save
			negocio.$save(function(response) {
				$location.path('negocios/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Negocio
		$scope.remove = function(negocio) {
			if ( negocio ) { 
				negocio.$remove();

				for (var i in $scope.negocios) {
					if ($scope.negocios [i] === negocio) {
						$scope.negocios.splice(i, 1);
					}
				}
			} else {
				$scope.negocio.$remove(function() {
					$location.path('negocios');
				});
			}
		};

		// Update existing Negocio
		$scope.update = function() {
			var negocio = $scope.negocio;

			negocio.$update(function() {
				$location.path('negocios/' + negocio._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Negocios
		$scope.find = function() {
			$scope.negocios = Negocios.query();
		};

		// Find existing Negocio
		$scope.findOne = function() {
			$scope.negocio = Negocios.get({ 
				negocioId: $stateParams.negocioId
			});
		};
	}
]);