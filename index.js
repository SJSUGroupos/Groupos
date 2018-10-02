var express = require("express");
//var jquery = require('jquery');
//var jquery = require('./node_modules/jquery/dist/jquery.js');
//var popper = require("popper.js");
//var bootstrap = require('./node_modules/bootstrap/dist/js/bootstrap.min.js');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

const PORT = 80;

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});


app.use("/",router);
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port ${PORT}");
});


