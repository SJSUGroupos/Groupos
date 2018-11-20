const express = require('express');
const router = express.Router();
const eventService = require('./event.service');

// routes
router.post('/new', createEvent);
router.get('/', getAll);
router.get('/userevents', getUserEvents);
router.get('/:id', getById);
router.put('/currUser', getByUserId);
router.put('/:id', update);
router.put('/sub/:id', subscribe)
router.put('/unsub/:id', unsubscribe)
router.delete('/:id', _delete);

module.exports = router;

function createEvent(req, res, next) {
	eventService.create(req.body)
		.then(eventId => {
			console.log("here");
			console.log('\n\n'+eventId);
			console.log('still in create event');
			eventId ? res.json(eventId) : res.sendStatus(404)
		}) 
		.catch(err => {
			console.log("err");
			next(err);
		});
}

function getAll(req, res, next) {
	eventService.getAll()
		.then(users => res.json(users))
		.catch(err => next(err));
}

function getUserEvents(req, res, next) {
	eventService.getById(req.user.sub)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function getById(req, res, next) {
	eventService.getById(req.params.id)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function getByUserId(req, res, next) {
	eventService.getByUserId(req.body)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function update(req, res, next) {
	eventService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function subscribe(req, res, next) {
	eventService.subscribe(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function unsubscribe(req, res, next) {
	eventService.unsubscribe(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	eventService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}
