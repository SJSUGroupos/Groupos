const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Event = db.Event;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Event.find().select('-eventId');
}

async function getById(id) {
    return await Event.findById(id).select('-eventId');
}

async function create(eventParam) {
    const event = new Event(eventParam);

    // save event
    await event.save(function (err) {
    if (err) {
		console.log("error creating document");
		return console.error(err);
	}
  });
}

async function update(id, eventParam) {
    const event = await Event.findById(id);

    // validate
    if (!event) throw 'User not found';
	
    // copy eventParam properties to user
    //Object.assign(event, eventParam);

    await event.save();
}

async function _delete(id) {
    await Event.findByIdAndRemove(id);
}
