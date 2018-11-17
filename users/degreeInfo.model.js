const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    title: { type: String, unique: true, required: true },
    degree: { type: String, required: true }
}, { versionKey: false });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Degree', schema);
