const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	userId: { type: String, required: true, unique: true },
	monday: [{
		startTime: Date,
		endTime: Date
	}],
	tuesday: [{
		startTime: Date,
		endTime: Date
	}],
	wednesday: [{
		startTime: Date,
		endTime: Date
	}],
	thursday: [{
		startTime: Date,
		endTime: Date
	}],
	friday: [{
		startTime: Date,
		endTime: Date
	}],
	saturday: [{
		startTime: Date,
		endTime: Date
	}],
	sunday: [{
		startTime: Date,
		endTime: Date
	}]
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Availabilities', schema);
