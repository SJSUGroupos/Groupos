const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
	uploadAvatar,
	authenticate,
	getAll,
	getById,
	create,
	update,
	delete: _delete
};

async function uploadAvatar(file) {
	//if (Object.keys(file).length == 0) {
	//	return res.status(400).json({ message: 'No files were uploaded.' });
	//}

	let avatar = file.files.data;
	throw {message: JSON.stringify(file.files)};
	//Use the mv() method to place the file somewhere on your server
	avatar.mv('http://localhost:5000/src/assets/images/test.jpg', function(err) {
		//avatar.mv('/src/assets/images/'+filename+'.png', function(err) {
		//if (err)
		//return res.status(500).(err);
	});

}

async function authenticate({ username, password }) {
	const user = await User.findOne({ username });
	if (user && bcrypt.compareSync(password, user.hash)) {
		const { hash, ...userWithoutHash } = user.toObject();
		const token = jwt.sign({ sub: user.id }, config.secret);
		return {
			...userWithoutHash,
			token
		};
	}
}

async function getAll() {
	return await User.find().select('-hash');
}

async function getById(id) {
	return await User.findById(id).select('-hash');
}

async function create(userParam) {
	// validate
	if (await User.findOne({ username: userParam.username })) {
		throw 'Username "' + userParam.username + '" is already taken';
	}

	const user = new User(userParam);

	// hash password
	if (userParam.password) {
		user.hash = bcrypt.hashSync(userParam.password, 10);
	}

	// save user
	await user.save(function (err) {
		if (err) {
			console.log("error creating document");
			return console.error(err);
		}
	});
}

async function update(id, userParam) {
	const user = await User.findById(id);

	// validate
	if (!user) throw 'User not found';
	if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
		throw 'Username "' + userParam.username + '" is already taken';
	}

	// hash password if it was entered
	if (userParam.password) {
		userParam.hash = bcrypt.hashSync(userParam.password, 10);
	}

	// copy userParam properties to user
	Object.assign(user, userParam);

	await user.save();
}

async function _delete(id) {
	await User.findByIdAndRemove(id);
}
