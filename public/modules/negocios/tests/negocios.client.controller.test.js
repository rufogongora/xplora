'use strict';

(function() {
	// Negocios Controller Spec
	describe('Negocios Controller Tests', function() {
		// Initialize global variables
		var NegociosController,
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

			// Initialize the Negocios controller.
			NegociosController = $controller('NegociosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Negocio object fetched from XHR', inject(function(Negocios) {
			// Create sample Negocio using the Negocios service
			var sampleNegocio = new Negocios({
				name: 'New Negocio'
			});

			// Create a sample Negocios array that includes the new Negocio
			var sampleNegocios = [sampleNegocio];

			// Set GET response
			$httpBackend.expectGET('negocios').respond(sampleNegocios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.negocios).toEqualData(sampleNegocios);
		}));

		it('$scope.findOne() should create an array with one Negocio object fetched from XHR using a negocioId URL parameter', inject(function(Negocios) {
			// Define a sample Negocio object
			var sampleNegocio = new Negocios({
				name: 'New Negocio'
			});

			// Set the URL parameter
			$stateParams.negocioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/negocios\/([0-9a-fA-F]{24})$/).respond(sampleNegocio);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.negocio).toEqualData(sampleNegocio);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Negocios) {
			// Create a sample Negocio object
			var sampleNegocioPostData = new Negocios({
				name: 'New Negocio'
			});

			// Create a sample Negocio response
			var sampleNegocioResponse = new Negocios({
				_id: '525cf20451979dea2c000001',
				name: 'New Negocio'
			});

			// Fixture mock form input values
			scope.name = 'New Negocio';

			// Set POST response
			$httpBackend.expectPOST('negocios', sampleNegocioPostData).respond(sampleNegocioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Negocio was created
			expect($location.path()).toBe('/negocios/' + sampleNegocioResponse._id);
		}));

		it('$scope.update() should update a valid Negocio', inject(function(Negocios) {
			// Define a sample Negocio put data
			var sampleNegocioPutData = new Negocios({
				_id: '525cf20451979dea2c000001',
				name: 'New Negocio'
			});

			// Mock Negocio in scope
			scope.negocio = sampleNegocioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/negocios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/negocios/' + sampleNegocioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid negocioId and remove the Negocio from the scope', inject(function(Negocios) {
			// Create new Negocio object
			var sampleNegocio = new Negocios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Negocios array and include the Negocio
			scope.negocios = [sampleNegocio];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/negocios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNegocio);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.negocios.length).toBe(0);
		}));
	});
}());