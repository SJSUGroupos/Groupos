const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Event = db.Event;

module.exports = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
	subscribe,
	unsubscribe,
    delete: _delete
};

async function getAll() {
    return await Event.find({ "public": true }).select('-eventId').sort({eventDate: 1});
}

async function getById(id) {
    return await Event.findById(id).select('-eventId');
}

async function create(eventParam) {
    const event = new Event(eventParam);

    // save event
    await event.save(function (err, product) {
    if (err) {
		console.log("error creating document");
		return console.error(err);
	}
	else if (product) {
		//console.log("new event info:");
		//console.log(product);
		//console.log(product['_id']);
		//return { "eventId" : product['_id'] };
	}
  });

	var test = { "eventId" : event['_id'] };
	console.log(test);
	return test;
}

async function getByUserId({ id }) {
    return await Event.find({ $or: [ { 'subscribers.id': id }, { 'creator.id': id } ] });
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
	if(exists(event.subscribers, 'id', userInfo['id'])) {
		throw 'Already subscribed to this event'; 
	}
    //Object.assign(event.subscribers, eventParam);
	event.subscribers.push(userInfo);

    await event.save();
}



function exists(arr, prop, value) {
	return arr.find(o => o[prop] === value) ? true : false;
}

async function unsubscribe(id, userId) {
    var event = await Event.findById(id);

    // validate
    if (!event) throw 'Event not found';

	var index = -1;
	for (var i = 0; i < event.subscribers.length; i++) {
		if(event.subscribers[i].id == userId.id) {
			index = i;
			break;
			//continue;
		}
	}
	if (index > -1) {
		event.subscribers.splice(index,1);
	}
	await event.save();
}

async function _delete(id) {
	await Event.findByIdAndRemove(id);
}
