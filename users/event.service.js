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
	subscribe,
	unsubscribe,
    delete: _delete
};

async function getAll() {
    return await Event.find().select('-eventId').sort({eventDate: 1});
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
    if (!event) throw 'Event not found';
	
    // copy eventParam properties to user
    Object.assign(event, eventParam);

    await event.save();
}

async function subscribe(id, userInfo) {
    const event = await Event.findById(id);

    // validate
    if (!event) throw 'Event not found';
	//if (event.subscribers.indexOf(userInfo['id']) > -1) {
	//	throw 'Already subscribed to this event'; 
	//}
	console.log(event.subscribers);
	if(exists(event.subscribers, 'id', userInfo['id'])) {
		throw 'Already subscribed to this event'; 
	}
    //Object.assign(event.subscribers, eventParam);
	event.subscribers.push(userInfo);

    await event.save();
}

async function _delete(id) {
    await Event.findByIdAndRemove(id);
}


function exists(arr, prop, value) {
	return arr.find(o => o[prop] === value) ? true : false;
}

async function unsubscribe(id, userId) {
    const event = await Event.findById(id);

    // validate
    if (!event) throw 'Event not found';
	//if (event.subscribers.indexOf(userInfo['id']) > -1) {
	//	throw 'Already subscribed to this event'; 
	//}
	console.log(event.subscribers);
	

	event.subscribers.find((o,i) => {
		if(o['id'] === userId['id']) {
			event.subscribers.splice(i,1);
		}
		else {
			throw 'You are not subscribed to this event'; 
		}
	});
	await event.save();
}

async function _delete(id) {
    await Event.findByIdAndRemove(id);
}
