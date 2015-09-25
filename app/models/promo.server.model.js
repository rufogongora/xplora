'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Promo Schema
 */
var PromoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Promo name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	start: {
		type: Date,
		default: Date.now,
		required : 'You need a starting date'
	},
	end : {
		type : Date,
		default : Date.now,
		required : 'You need an ending date'
	},
	img : {
		type : String,
		default : 'http://placehold.it/250x250'
	},
	ciudad : {
		type : String,
		default : '',
		required : 'Necesitas una ciudad'
	},
	negocio : {
		type: Schema.ObjectId,
		ref : 'Negocio'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Promo', PromoSchema);