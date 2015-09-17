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
	nombre: {
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
		nombre : String
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Estado', EstadoSchema);