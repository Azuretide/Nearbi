var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	name: {type:String, required: true},
	id: {type:String, required: true},
	address: {type:Object, properties: {
	 address_1: {type:String},
	 address_2: {type:String},
	 city: {type:String},
	 region: {type:String},
	 postal_code: {type:String},
	 country: {type:String}
	 }},
	description: {type:String, required: false},
	start: {type:String, required: true},
	end: {type:String, required: true},
	latitude: {type:String, required: true},
	longitude: {type:String, required: true},
	url: {type:String, required: true}
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;