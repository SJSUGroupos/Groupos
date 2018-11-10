const mongoose = require('mongoose');
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
	},
	coursework: [String],
    createdDate: { type: Date, default: Date.now }
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
