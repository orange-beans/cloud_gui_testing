/**
 * Created by ChengCheng on 12/2/2016.
 */
// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var
	path       =  require('path'),
	//http       =  require('http'),
	net        =  require('net'),
	express    =  require('express'),
  mosca      =  require('mosca'),

  routes     =  require('./lib/routes'),

// required middle-wares which are omitted in Express 4.x
//
	bodyParser     =  require( 'body-parser'),
	methodOverride =  require( 'method-override'),
	logger         =  require( 'morgan'),
	errorHandler   =  require( 'errorhandler'),

	app        =  express(),
	//server     =  http.createServer( app ),


	TMClient = require('textmagic-rest-client'),
  socket = require( 'socket.io'),

	portConfig = {
		port_name : process.argv[2],
		port_num  : 80
	};

// ============= END MODULE SCOPE VARIABLES ===============

const SMS_USERNAME = "chengchengzhang";
const API_KEY = "JTkZnwlw8c1Ia6Tya2TwZ0SKA0nWvw";

// ------------- BEGIN SERVER CONFIGURATION ---------------
// configuration for all environments
//

//app.use( bodyParser() );
//app.use( methodOverride() );
app.use( express.static( path.join(__dirname, 'public' )));
//app.use( app.router );

// configuration for development only
//
//if ( 'development' === app.get( 'env' )) {
//	app.use( logger() );
//	app.use( errorHandler({
//		dumpExceptions : true,
//		showStack      : true
//	}) );
//}
// configuration for production only
//
//if ( process.env.NODE_ENV === 'production' ){
//	app.use( errorHandler() );
//}

var server = app.listen( portConfig.port_num );

var io = socket.listen( server );

//io.on('connection', function(socket) {
//  socket.emit('event', {name: 'bbaba'});
//  io.emit('event', {name: 'haha'});
//});

var room = 'abc';
io.on('connection', function(socket) {
  socket.on('join-room', function(room) {
    socket.join(room);

    io.emit('this', 'will be received by everyone');
    io.in(room).emit('message', 'party');
    io.in('bar').emit('message', 'bar');
  });

  socket.on('room-msg', function(data) {
    io.in(room).emit('room-msg', data);
  });

});

//var c = new TMClient(SMS_USERNAME, API_KEY);
//c.Messages.send({text: 'Test SMS From Beans.im', phones:'+6581380936'}, function(err, res){
//  console.log('Messages.send()', err, res);
//});

// ============== END SERVER CONFIGURATION ================

// ----------------- BEGIN START SERVER -------------------
console.log(
	'Express server listening on port %d in %s model',
	server.address().port, app.settings.env
);


