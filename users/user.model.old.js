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
		monday: [[Date]],
		tuesday: [[Date]],
		wednesday: [[Date]],
		thursday: [[Date]],
		friday: [[Date]],
		saturday: [[Date]],
		sunday: [[Date]]
	},
	coursework: [String],
    createdDate: { type: Date, default: Date.now }
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
