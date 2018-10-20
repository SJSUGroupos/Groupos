const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	groupId: { type: String, unique: true, required: true },
	creator: { type: String, unique: true, required: true },
	subscribers: { type: String, required: false },
	public: { type: Boolean, unique: true, required: true },
	description: { type: String, required: false },
    groupName: { type: String, required: true },
    scheduledDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Groups', schema);
