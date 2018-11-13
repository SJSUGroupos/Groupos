const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	startTime: Number,
	endTime: Number
}, { versionKey: false, _id: false });

schema.set('toJSON', { virtuals: true });

//module.exports = mongoose.model('TimeRange', schema);
module.exports = schema;
