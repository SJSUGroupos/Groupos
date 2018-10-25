const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	creator: { type: String, unique: false, required: true },
	subscribers: { type: [String], required: false },
	public: { type: Boolean, unique: false, required: true },
	description: { type: String, required: false },
    eventName: { type: String, required: true },
    scheduledDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', schema);
