var express = require("express");
global.jquery = global.$ = require('jquery');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//var jquery = require('./node_modules/jquery/dist/jquery.js');
//var popper = require("popper.js");
//var bootstrap = require('./node_modules/bootstrap/dist/js/bootstrap.min.js')
//var bootstrap = require('bootstrap');
var app = express();
var router = express.Router();
var path = __dirname + 'views/';

const PORT = process.env.PORT || 5000;

const mongoURL = 'mongodb://groupos_user:Groupos1234@ds121753.mlab.com:21753/heroku_25s7vd7q';

// Database Name
const dbName = 'heroku_25s7vd7q';

// Create a new MongoClient
const client = new MongoClient(mongoURL);

console.log(__dirname)
// Use connect method to connect to the Server
client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to mongodb server");

	const db = client.db(dbName);

	client.close();
});


router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

router.get("/",function(req,res){
	res.sendFile(path + "index.html");
});

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/views'));
app.use("/",router);
app.use("*",function(req,res){
	res.sendFile(path + "404.html");
});

app.listen(PORT,function(){
	console.log(`Live at Port ${PORT}`);
});


