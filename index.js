require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const multer = require('multer')
var upload = multer({ storage: multer.memoryStorage() })
var router = express.Router();
const PORT = process.env.PORT || 5000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/events', require('./users/event.controller'));

// global error handler
app.use(errorHandler);


app.use(express.static(__dirname + '/dist/groupos-app'));
app.use(express.static(__dirname + '/src/assets/images'));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/node_modules/socket.io-client/dist'));





let timerId = null,
    sockets = new Set(),
	clients = new Object();

console.log(clients);


io.on('connection', socket => {

  sockets.add(socket);
  console.log(`Socket ${socket.id} added`);

	socket.on('clientId', data => {
		console.log('recv clientId event');
		console.log(data);
		clients[data['id']] = socket.id;
		console.log(clients);
		socket.on('invite', data => {
			console.log('recieved: '+data);
			console.log(data['recvId']);
			console.log(clients[data['recvId']]);
			if(clients[data['recvId']]) {
				console.log("got here");
				var recvSocket = clients[data['recvId']];
				//recvSocket.emit('invite', data);
				io.to(recvSocket).emit('invite', data);

			}
		});

		//socket.emit(data['id'], { invite: 'new invite'});
		//socket.emit('invite', { data: 'new invite'});
	});


	socket.on('disconnect', () => {
		console.log(`Deleting socket: ${socket.id}`);

		sockets.delete(socket);
		console.log(`Remaining sockets: ${sockets.size}`);
	});

});

function startTimer() {
	//Simulate stock data received by the server that needs 
	//to be pushed to clients
	timerId = setInterval(() => {
		if (!sockets.size) {
			clearInterval(timerId);
			timerId = null;
			console.log(`Timer stopped`);
		}
		let value = ((Math.random() * 50) + 1).toFixed(2);
		//See comment above about using a "room" to emit to an entire
		//group of sockets if appropriate for your scenario
		//This example tracks each socket and emits to each one
		for (const s of sockets) {
			//console.log(`Emitting value: ${value}`);
			s.emit('data', { data: value });
			//s.emit('invite', { data: 'new invite'});
		}

	}, 2000);
}






app.use("*",function(req,res){
	res.sendFile(__dirname + "/dist/groupos-app/index.html");
});

/*app.listen(PORT,function(){
	console.log(`Live at Port ${PORT}`);
});*/

server.listen(PORT,function(){
	console.log(`Live at Port ${PORT}`);
});





