const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	creator: { type: String, unique: false, required: true },
	subscribers: { type: [String], required: false },
	public: { type: Boolean, unique: false, required: true },
	description: { type: String, required: false },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true},
    eventStartTime: { type: Date, required: false},
    eventEndTime: { type: Date, required: false},
    eventPlace: { type: String, required: false},
    eventCourse: { type: String, required: false},
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', schema);
