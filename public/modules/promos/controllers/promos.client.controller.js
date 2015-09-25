'use strict';

// Promos controller
angular.module('promos').controller('PromosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Promos',
	function($scope, $stateParams, $location, Authentication, Promos) {
		$scope.authentication = Authentication;

		// Create new Promo
		$scope.create = function() {
			// Create new Promo object
			var promo = new Promos ({
				name: this.name
			});

			// Redirect after save
			promo.$save(function(response) {
				$location.path('promos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Promo
		$scope.remove = function(promo) {
			if ( promo ) { 
				promo.$remove();

				for (var i in $scope.promos) {
					if ($scope.promos [i] === promo) {
						$scope.promos.splice(i, 1);
					}
				}
			} else {
				$scope.promo.$remove(function() {
					$location.path('promos');
				});
			}
		};

		// Update existing Promo
		$scope.update = function() {
			var promo = $scope.promo;

			promo.$update(function() {
				$location.path('promos/' + promo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Promos
		$scope.find = function() {
			$scope.promos = Promos.query();
		};

		// Find existing Promo
		$scope.findOne = function() {
			$scope.promo = Promos.get({ 
				promoId: $stateParams.promoId
			});
		};
	}
]);