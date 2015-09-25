'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Promo = mongoose.model('Promo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, promo;

/**
 * Promo routes tests
 */
describe('Promo CRUD tests', function() {
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

		// Save a user to the test db and create new Promo
		user.save(function() {
			promo = {
				name: 'Promo Name'
			};

			done();
		});
	});

	it('should be able to save Promo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Promo
				agent.post('/promos')
					.send(promo)
					.expect(200)
					.end(function(promoSaveErr, promoSaveRes) {
						// Handle Promo save error
						if (promoSaveErr) done(promoSaveErr);

						// Get a list of Promos
						agent.get('/promos')
							.end(function(promosGetErr, promosGetRes) {
								// Handle Promo save error
								if (promosGetErr) done(promosGetErr);

								// Get Promos list
								var promos = promosGetRes.body;

								// Set assertions
								(promos[0].user._id).should.equal(userId);
								(promos[0].name).should.match('Promo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Promo instance if not logged in', function(done) {
		agent.post('/promos')
			.send(promo)
			.expect(401)
			.end(function(promoSaveErr, promoSaveRes) {
				// Call the assertion callback
				done(promoSaveErr);
			});
	});

	it('should not be able to save Promo instance if no name is provided', function(done) {
		// Invalidate name field
		promo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Promo
				agent.post('/promos')
					.send(promo)
					.expect(400)
					.end(function(promoSaveErr, promoSaveRes) {
						// Set message assertion
						(promoSaveRes.body.message).should.match('Please fill Promo name');
						
						// Handle Promo save error
						done(promoSaveErr);
					});
			});
	});

	it('should be able to update Promo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Promo
				agent.post('/promos')
					.send(promo)
					.expect(200)
					.end(function(promoSaveErr, promoSaveRes) {
						// Handle Promo save error
						if (promoSaveErr) done(promoSaveErr);

						// Update Promo name
						promo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Promo
						agent.put('/promos/' + promoSaveRes.body._id)
							.send(promo)
							.expect(200)
							.end(function(promoUpdateErr, promoUpdateRes) {
								// Handle Promo update error
								if (promoUpdateErr) done(promoUpdateErr);

								// Set assertions
								(promoUpdateRes.body._id).should.equal(promoSaveRes.body._id);
								(promoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Promos if not signed in', function(done) {
		// Create new Promo model instance
		var promoObj = new Promo(promo);

		// Save the Promo
		promoObj.save(function() {
			// Request Promos
			request(app).get('/promos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Promo if not signed in', function(done) {
		// Create new Promo model instance
		var promoObj = new Promo(promo);

		// Save the Promo
		promoObj.save(function() {
			request(app).get('/promos/' + promoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', promo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Promo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Promo
				agent.post('/promos')
					.send(promo)
					.expect(200)
					.end(function(promoSaveErr, promoSaveRes) {
						// Handle Promo save error
						if (promoSaveErr) done(promoSaveErr);

						// Delete existing Promo
						agent.delete('/promos/' + promoSaveRes.body._id)
							.send(promo)
							.expect(200)
							.end(function(promoDeleteErr, promoDeleteRes) {
								// Handle Promo error error
								if (promoDeleteErr) done(promoDeleteErr);

								// Set assertions
								(promoDeleteRes.body._id).should.equal(promoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Promo instance if not signed in', function(done) {
		// Set Promo user 
		promo.user = user;

		// Create new Promo model instance
		var promoObj = new Promo(promo);

		// Save the Promo
		promoObj.save(function() {
			// Try deleting Promo
			request(app).delete('/promos/' + promoObj._id)
			.expect(401)
			.end(function(promoDeleteErr, promoDeleteRes) {
				// Set message assertion
				(promoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Promo error error
				done(promoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Promo.remove().exec();
		done();
	});
});