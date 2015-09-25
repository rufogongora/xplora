'use strict';

(function() {
	// Promos Controller Spec
	describe('Promos Controller Tests', function() {
		// Initialize global variables
		var PromosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Promos controller.
			PromosController = $controller('PromosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Promo object fetched from XHR', inject(function(Promos) {
			// Create sample Promo using the Promos service
			var samplePromo = new Promos({
				name: 'New Promo'
			});

			// Create a sample Promos array that includes the new Promo
			var samplePromos = [samplePromo];

			// Set GET response
			$httpBackend.expectGET('promos').respond(samplePromos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.promos).toEqualData(samplePromos);
		}));

		it('$scope.findOne() should create an array with one Promo object fetched from XHR using a promoId URL parameter', inject(function(Promos) {
			// Define a sample Promo object
			var samplePromo = new Promos({
				name: 'New Promo'
			});

			// Set the URL parameter
			$stateParams.promoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/promos\/([0-9a-fA-F]{24})$/).respond(samplePromo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.promo).toEqualData(samplePromo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Promos) {
			// Create a sample Promo object
			var samplePromoPostData = new Promos({
				name: 'New Promo'
			});

			// Create a sample Promo response
			var samplePromoResponse = new Promos({
				_id: '525cf20451979dea2c000001',
				name: 'New Promo'
			});

			// Fixture mock form input values
			scope.name = 'New Promo';

			// Set POST response
			$httpBackend.expectPOST('promos', samplePromoPostData).respond(samplePromoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Promo was created
			expect($location.path()).toBe('/promos/' + samplePromoResponse._id);
		}));

		it('$scope.update() should update a valid Promo', inject(function(Promos) {
			// Define a sample Promo put data
			var samplePromoPutData = new Promos({
				_id: '525cf20451979dea2c000001',
				name: 'New Promo'
			});

			// Mock Promo in scope
			scope.promo = samplePromoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/promos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/promos/' + samplePromoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid promoId and remove the Promo from the scope', inject(function(Promos) {
			// Create new Promo object
			var samplePromo = new Promos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Promos array and include the Promo
			scope.promos = [samplePromo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/promos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePromo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.promos.length).toBe(0);
		}));
	});
}());