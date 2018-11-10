const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	creator: { type: Object, unique: false, required: true },
	subscribers: { type: Array, required: false },
	public: { type: Boolean, unique: false, required: true },
	description: { type: String, required: false },
    eventName: { type: String, required: true },
    eventDate: { type: Number, required: true},
    eventStartTime: { type: Number, required: false},
    eventEndTime: { type: Number, required: false},
    eventPlace: { type: String, required: false},
    eventCourse: { type: String, required: false},
    createdDate: { type: Date, default: Date.now }
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', schema);
