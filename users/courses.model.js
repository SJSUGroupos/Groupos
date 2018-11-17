const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    label: { type: String, required: true }
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Courses', schema);
