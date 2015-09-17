'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Estado = mongoose.model('Estado'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, estado;

/**
 * Estado routes tests
 */
describe('Estado CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Estado
		user.save(function() {
			estado = {
				name: 'Estado Name'
			};

			done();
		});
	});

	it('should be able to save Estado instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estado
				agent.post('/estados')
					.send(estado)
					.expect(200)
					.end(function(estadoSaveErr, estadoSaveRes) {
						// Handle Estado save error
						if (estadoSaveErr) done(estadoSaveErr);

						// Get a list of Estados
						agent.get('/estados')
							.end(function(estadosGetErr, estadosGetRes) {
								// Handle Estado save error
								if (estadosGetErr) done(estadosGetErr);

								// Get Estados list
								var estados = estadosGetRes.body;

								// Set assertions
								(estados[0].user._id).should.equal(userId);
								(estados[0].name).should.match('Estado Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Estado instance if not logged in', function(done) {
		agent.post('/estados')
			.send(estado)
			.expect(401)
			.end(function(estadoSaveErr, estadoSaveRes) {
				// Call the assertion callback
				done(estadoSaveErr);
			});
	});

	it('should not be able to save Estado instance if no name is provided', function(done) {
		// Invalidate name field
		estado.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estado
				agent.post('/estados')
					.send(estado)
					.expect(400)
					.end(function(estadoSaveErr, estadoSaveRes) {
						// Set message assertion
						(estadoSaveRes.body.message).should.match('Please fill Estado name');
						
						// Handle Estado save error
						done(estadoSaveErr);
					});
			});
	});

	it('should be able to update Estado instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estado
				agent.post('/estados')
					.send(estado)
					.expect(200)
					.end(function(estadoSaveErr, estadoSaveRes) {
						// Handle Estado save error
						if (estadoSaveErr) done(estadoSaveErr);

						// Update Estado name
						estado.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Estado
						agent.put('/estados/' + estadoSaveRes.body._id)
							.send(estado)
							.expect(200)
							.end(function(estadoUpdateErr, estadoUpdateRes) {
								// Handle Estado update error
								if (estadoUpdateErr) done(estadoUpdateErr);

								// Set assertions
								(estadoUpdateRes.body._id).should.equal(estadoSaveRes.body._id);
								(estadoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Estados if not signed in', function(done) {
		// Create new Estado model instance
		var estadoObj = new Estado(estado);

		// Save the Estado
		estadoObj.save(function() {
			// Request Estados
			request(app).get('/estados')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Estado if not signed in', function(done) {
		// Create new Estado model instance
		var estadoObj = new Estado(estado);

		// Save the Estado
		estadoObj.save(function() {
			request(app).get('/estados/' + estadoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', estado.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Estado instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estado
				agent.post('/estados')
					.send(estado)
					.expect(200)
					.end(function(estadoSaveErr, estadoSaveRes) {
						// Handle Estado save error
						if (estadoSaveErr) done(estadoSaveErr);

						// Delete existing Estado
						agent.delete('/estados/' + estadoSaveRes.body._id)
							.send(estado)
							.expect(200)
							.end(function(estadoDeleteErr, estadoDeleteRes) {
								// Handle Estado error error
								if (estadoDeleteErr) done(estadoDeleteErr);

								// Set assertions
								(estadoDeleteRes.body._id).should.equal(estadoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Estado instance if not signed in', function(done) {
		// Set Estado user 
		estado.user = user;

		// Create new Estado model instance
		var estadoObj = new Estado(estado);

		// Save the Estado
		estadoObj.save(function() {
			// Try deleting Estado
			request(app).delete('/estados/' + estadoObj._id)
			.expect(401)
			.end(function(estadoDeleteErr, estadoDeleteRes) {
				// Set message assertion
				(estadoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Estado error error
				done(estadoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Estado.remove().exec();
		done();
	});
});