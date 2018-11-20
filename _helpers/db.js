const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString, {useNewUrlParser : true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
	console.log("Connected successfully to mongodb server");
});

module.exports = {
	User: require('../users/user.model'),
	Event: require('../users/event.model'),
	Invites: require('../users/invites.model')
};
