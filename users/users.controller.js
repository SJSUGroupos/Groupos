const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const fs = require('fs');
const dir = require('path').dirname(require.main.filename);
// routes
//router.post('/avatar', uploadAvatar);
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

	console.log("got here");
	//console.log(req.file);
	//console.log('body',req.body);
	if (req.files) {

    console.log('Uploaded: ', req.files);
    // Homework: Upload file to S3
	}
	else if(req.file) {
		console.log('file: ', req.file);
	}
	var str = req.body['avatar'];
	console.log(str.indexOf(","));
	var fen = str.substring(str.indexOf(","),str.length-1);

	//console.log(fen);
	var buf = Buffer.from(fen,'base64');
	console.log(buf);
	fs.writeFileSync(dir +'/src/assets/images/test.jpg',buf);
	res.json({message: "done"});
	//fs.rename(buf,'/src/assets/images/test.jpg', function(err) { console.log(err);  });



});


function uploadAvatar(req, res, next) {

	console.log("got here");
	res.json("hello");
	//userService.uploadAvatar(req.files)
		//.then(avatar => avatar ? res.json(avatar) : res.status(500).json({ message: 'Error uploading image' }))
		//.catch(err => next(err));
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
