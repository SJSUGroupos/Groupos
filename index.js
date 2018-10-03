var express = require("express");
global.jquery = global.$ = require('jquery');
//var jquery = require('./node_modules/jquery/dist/jquery.js');
//var popper = require("popper.js");
//var bootstrap = require('./node_modules/bootstrap/dist/js/bootstrap.min.js')
var bootstrap = require('bootstrap');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

const PORT = process.env.PORT || 5000;

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

app.use(express.static(__dirname + '/node_modules'));
app.use("/",router);
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(PORT,function(){
  console.log(`Live at Port ${PORT}`);
});


