'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Estado Schema
 */
var EstadoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Estado name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	ciudades : [{
		name : String
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Estado', EstadoSchema);