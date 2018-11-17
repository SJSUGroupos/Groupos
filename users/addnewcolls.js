const config = require('../config.json');
const mongoose = require('mongoose');
const courses = require('./courses.model')
const D = require('./degreeInfo.model')
const fs = require('fs');
mongoose.connect(config.connectionString, {useNewUrlParser : true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
	console.log("Connected successfully to mongodb server");
	/*fs.readFile('C:\\Users\\Brad\\code\\Groupos\\users\\CourseList.json', 'utf8',function(err, data) {
		if (err)
			return console.log(err);
		//console.log(data);
	});*/
	var file = fs.readFileSync('C:\\Users\\Brad\\code\\Groupos\\users\\majorsList.json', 'utf8');
	var d = JSON.parse(file);
	//console.log(d);
	d.forEach(function(x){
		//const course = new courses(x);
		const degree = new D(x);
		degree.save(function (err) {
			if (err) {
				console.log("error creating document");
				return console.error(err);
			}
		});
	})

	console.log("done uploading");

});




module.exports = {
	User: require('../users/user.model'),
	Event: require('../users/event.model')
};
