const express = require('express');
const router = express.Router();
const eventService = require('./event.service');

// routes
router.post('/new', createEvent);
router.get('/', getAll);
router.get('/userevents', getUserEvents);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function createEvent(req, res, next) {
	eventService.create(req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
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

function update(req, res, next) {
	eventService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	eventService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}
