const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	userId: { type: String, unique: true, required: true },
	invites: [
		{ 
			senderId: { type: String, required: true },
			eventName: { type: String, required: true },
			eventId: { type: String, required: true },
			eventDate: { type: String, required: false },
			eventStartTime: { type: String, required: false },
			eventEndTime: { type: String, required: false },
			message: { type: String, required: false },
			firstName: { type: String, required: false },
			lastName: { type: String, required: false },
			avatar: { type: String, required: false },
			viewed: { type: Boolean, required: true, default: false }
		}
	]
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Invites', schema);
