const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const fs = require('fs');
const dir = require('path').dirname(require.main.filename);
// routes
//router.post('/avatar', uploadAvatar);
router.get('/usersbytime', getUsersByTime);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

router.post('/avatar', upload.single('avatar'), [
  // validation ...
], (req, res) => {
  // error handling ...
	var str = req.body['avatar'].split(",");

	var fen = str[1];

	//extract [filetype];base64
	var exf = str[0].split("/");
	var exf = exf[1];
	var exf = exf.split(";");
	var ft = exf[0];
	var buf = Buffer.from(fen,'base64');
	fs.writeFileSync(dir +'/src/assets/images/'+req.body['filename']+'.' + ft,buf);
	res.json({src: '/src/assets/images/'+req.body['filename']+'.' + ft });



});



function getUsersByTime(req, res, next) {
	userService.getUsersByTime(req.body)
		.then(users => users ? res.json(users) : res.sendStatus(404))
		.catch(err => next(err));
}

function uploadAvatar(req, res, next) {

	console.log(req.file);
	console.log(req.files);
	userService.uploadAvatar(req.body)
		.then(avatar => avatar ? res.json(avatar) : res.status(500).json({ message: 'Error uploading image' }))
		.catch(err => next(err));
}

function authenticate(req, res, next) {
	userService.authenticate(req.body)
		.then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
		.catch(err => next(err));
}

function register(req, res, next) {
	userService.create(req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function getAll(req, res, next) {
	userService.getAll()
		.then(users => res.json(users))
		.catch(err => next(err));
}

function getCurrent(req, res, next) {
	userService.getById(req.user.sub)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function getById(req, res, next) {
	userService.getById(req.params.id)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function update(req, res, next) {
	userService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	userService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}
