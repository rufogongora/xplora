'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Negocio Schema
 */
var NegocioSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Porfavor llena el nombre',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	categoria : {
		type : String,
		default : '',
		required : 'La categoria es requerida'
	},
	important : {
		type : Boolean,
		default : false
	},
	estado : {
		type : String,
		required : 'El estado es requerido',
		default : 'Tamaulipas'
	},
	ciudad : {
		type : String,
		required : 'La ciudad es requerida',
		default : 'Rio Bravo'
	},
	direccion : {
		type : String,
		required : 'La direccion es requerido',
		default : 'Roble #213'
	},
	logo : {
		type : String,
		required : 'El logo es requerido',
		default : 'http://placehold.it/150x150'
	},
	img : {
		type : String,
		required : 'El logo es requerido',
		default : 'http://placehold.it/350x150'
	},
	open : {
		type : String,
		required : 'Horario requerido',
		default : '8:00 A.M.'
	},
	close : {
		type : String,
		required : 'Horario Requerido',
		default : '12:00 P.M.'
	},
	mensaje : {
		type : String,
		default : 'Hola!'
	},
	likes : {
		type : Number,
		default : 0
	},
	descripcion : {
		type : String,
		default : 'Esta es la descripcion'
	},
	approved : {
		type : Boolean,
		default : false
	},
	promos : {
		type : [{
			type : Schema.ObjectId,
			ref : 'Promo'
		}],
		default : []
	}
});

mongoose.model('Negocio', NegocioSchema);