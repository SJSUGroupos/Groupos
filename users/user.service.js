const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const Invites = db.Invites;
const fs = require('fs');
const dir = require('path').dirname(require.main.filename);

module.exports = {
	deleteInvite,
	uploadAvatar,
	authenticate,
	getAll,
	getById,
	create,
	update,
	delete: _delete,
	getUsersByTime,
	sendInvite,
	getInvites
};

async function uploadAvatar(data) {
	console.log(data);
	var str = data['avatar'];
	var fen = str.substring(str.indexOf(","),str.length-1);
	var buf = Buffer.from(fen,'base64');
	await fs.writeFile(dir +'/src/assets/images/test.jpg',buf, function (err) {
		if (err) {
			console.log("error writing file");
			return console.error(err);
		}
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

async function getUsersByTime(criteria) {
	console.log(criteria);
	const query = 
		{
			["availabilities."+criteria.day]:
			{
				$elemMatch:
				{
					endTime: {$gte: criteria.eventStartTime},
					startTime: {$lte: criteria.eventEndTime}
				}
			}, 
			'_id': { $ne: criteria.userId }
		};
	
	return await User.find(query).select('-hash');
}


async function sendInvite(inviteData) {
	console.log("inside sendInvite");
	console.log(inviteData.length);
	for(var i = 0; i < inviteData.length; i++) {
		console.log(inviteData[i]);
		//await Invites.updateOne({ userId: inviteData[i]['userId'] }, { $push: { invites: inviteData[i]['invites']} }, { upsert: true });
		await Invites.updateOne({ userId: inviteData[i]['userId'], 'invites.eventId': {$ne: inviteData[i]['invites']['eventId']}}, { $push: { invites: inviteData[i]['invites']} }, { upsert: true });

	}
}

async function getInvites(id) {
	//return await Invites.findById(id).select('-hash');
	//return await Invites.find({ userId: id }).select({"invites": 1});
	var arr = await Invites.find({ userId: id }).select({"invites": 1});
	return arr[0]['invites'];

}


async function deleteInvite(inviteData) {

	return await Invites.updateOne({ userId: inviteData['userId'] }, { $pull: { invites: { eventId: inviteData['eventId'] } } });

}
