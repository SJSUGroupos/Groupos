const mongoose = require('mongoose');
const TimeRange = require('./timeRange.schema');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    avatar: { type: String, required: false },
    major: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
	availabilities: { 
		monday: [TimeRange],
		tuesday: [TimeRange],
		wednesday: [TimeRange],
		thursday: [TimeRange],
		friday: [TimeRange],
		saturday: [TimeRange],
		sunday: [TimeRange]
	},
	coursework: [String],
    createdDate: { type: Date, default: Date.now }
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
