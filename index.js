require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

var router = express.Router();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
//app.use('/users', jwt());
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);


app.use(express.static(__dirname + '/dist/groupos-app'));
app.use(express.static(__dirname));

app.use("*",function(req,res){
	res.sendFile(__dirname + "/dist/groupos-app/index.html");
});

app.listen(PORT,function(){
	console.log(`Live at Port ${PORT}`);
});


