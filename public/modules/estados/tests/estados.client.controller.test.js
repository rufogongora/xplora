'use strict';

(function() {
	// Estados Controller Spec
	describe('Estados Controller Tests', function() {
		// Initialize global variables
		var EstadosController,
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

			// Initialize the Estados controller.
			EstadosController = $controller('EstadosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Estado object fetched from XHR', inject(function(Estados) {
			// Create sample Estado using the Estados service
			var sampleEstado = new Estados({
				name: 'New Estado'
			});

			// Create a sample Estados array that includes the new Estado
			var sampleEstados = [sampleEstado];

			// Set GET response
			$httpBackend.expectGET('estados').respond(sampleEstados);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.estados).toEqualData(sampleEstados);
		}));

		it('$scope.findOne() should create an array with one Estado object fetched from XHR using a estadoId URL parameter', inject(function(Estados) {
			// Define a sample Estado object
			var sampleEstado = new Estados({
				name: 'New Estado'
			});

			// Set the URL parameter
			$stateParams.estadoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/estados\/([0-9a-fA-F]{24})$/).respond(sampleEstado);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.estado).toEqualData(sampleEstado);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Estados) {
			// Create a sample Estado object
			var sampleEstadoPostData = new Estados({
				name: 'New Estado'
			});

			// Create a sample Estado response
			var sampleEstadoResponse = new Estados({
				_id: '525cf20451979dea2c000001',
				name: 'New Estado'
			});

			// Fixture mock form input values
			scope.name = 'New Estado';

			// Set POST response
			$httpBackend.expectPOST('estados', sampleEstadoPostData).respond(sampleEstadoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Estado was created
			expect($location.path()).toBe('/estados/' + sampleEstadoResponse._id);
		}));

		it('$scope.update() should update a valid Estado', inject(function(Estados) {
			// Define a sample Estado put data
			var sampleEstadoPutData = new Estados({
				_id: '525cf20451979dea2c000001',
				name: 'New Estado'
			});

			// Mock Estado in scope
			scope.estado = sampleEstadoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/estados\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/estados/' + sampleEstadoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid estadoId and remove the Estado from the scope', inject(function(Estados) {
			// Create new Estado object
			var sampleEstado = new Estados({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Estados array and include the Estado
			scope.estados = [sampleEstado];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/estados\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEstado);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.estados.length).toBe(0);
		}));
	});
}());