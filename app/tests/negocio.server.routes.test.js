'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Negocio = mongoose.model('Negocio'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, negocio;

/**
 * Negocio routes tests
 */
describe('Negocio CRUD tests', function() {
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

		// Save a user to the test db and create new Negocio
		user.save(function() {
			negocio = {
				name: 'Negocio Name'
			};

			done();
		});
	});

	it('should be able to save Negocio instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Negocio
				agent.post('/negocios')
					.send(negocio)
					.expect(200)
					.end(function(negocioSaveErr, negocioSaveRes) {
						// Handle Negocio save error
						if (negocioSaveErr) done(negocioSaveErr);

						// Get a list of Negocios
						agent.get('/negocios')
							.end(function(negociosGetErr, negociosGetRes) {
								// Handle Negocio save error
								if (negociosGetErr) done(negociosGetErr);

								// Get Negocios list
								var negocios = negociosGetRes.body;

								// Set assertions
								(negocios[0].user._id).should.equal(userId);
								(negocios[0].name).should.match('Negocio Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Negocio instance if not logged in', function(done) {
		agent.post('/negocios')
			.send(negocio)
			.expect(401)
			.end(function(negocioSaveErr, negocioSaveRes) {
				// Call the assertion callback
				done(negocioSaveErr);
			});
	});

	it('should not be able to save Negocio instance if no name is provided', function(done) {
		// Invalidate name field
		negocio.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Negocio
				agent.post('/negocios')
					.send(negocio)
					.expect(400)
					.end(function(negocioSaveErr, negocioSaveRes) {
						// Set message assertion
						(negocioSaveRes.body.message).should.match('Please fill Negocio name');
						
						// Handle Negocio save error
						done(negocioSaveErr);
					});
			});
	});

	it('should be able to update Negocio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Negocio
				agent.post('/negocios')
					.send(negocio)
					.expect(200)
					.end(function(negocioSaveErr, negocioSaveRes) {
						// Handle Negocio save error
						if (negocioSaveErr) done(negocioSaveErr);

						// Update Negocio name
						negocio.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Negocio
						agent.put('/negocios/' + negocioSaveRes.body._id)
							.send(negocio)
							.expect(200)
							.end(function(negocioUpdateErr, negocioUpdateRes) {
								// Handle Negocio update error
								if (negocioUpdateErr) done(negocioUpdateErr);

								// Set assertions
								(negocioUpdateRes.body._id).should.equal(negocioSaveRes.body._id);
								(negocioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Negocios if not signed in', function(done) {
		// Create new Negocio model instance
		var negocioObj = new Negocio(negocio);

		// Save the Negocio
		negocioObj.save(function() {
			// Request Negocios
			request(app).get('/negocios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Negocio if not signed in', function(done) {
		// Create new Negocio model instance
		var negocioObj = new Negocio(negocio);

		// Save the Negocio
		negocioObj.save(function() {
			request(app).get('/negocios/' + negocioObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', negocio.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Negocio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Negocio
				agent.post('/negocios')
					.send(negocio)
					.expect(200)
					.end(function(negocioSaveErr, negocioSaveRes) {
						// Handle Negocio save error
						if (negocioSaveErr) done(negocioSaveErr);

						// Delete existing Negocio
						agent.delete('/negocios/' + negocioSaveRes.body._id)
							.send(negocio)
							.expect(200)
							.end(function(negocioDeleteErr, negocioDeleteRes) {
								// Handle Negocio error error
								if (negocioDeleteErr) done(negocioDeleteErr);

								// Set assertions
								(negocioDeleteRes.body._id).should.equal(negocioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Negocio instance if not signed in', function(done) {
		// Set Negocio user 
		negocio.user = user;

		// Create new Negocio model instance
		var negocioObj = new Negocio(negocio);

		// Save the Negocio
		negocioObj.save(function() {
			// Try deleting Negocio
			request(app).delete('/negocios/' + negocioObj._id)
			.expect(401)
			.end(function(negocioDeleteErr, negocioDeleteRes) {
				// Set message assertion
				(negocioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Negocio error error
				done(negocioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Negocio.remove().exec();
		done();
	});
});