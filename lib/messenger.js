/**
 * Created by cczhang on 13/2/2015.
 */
/*
 * Module       : messaging.js
 * Description  : to provide real-time messaging
 * Dependency   : socket.io,
 *                ./dongle;
 *
 */
/*
 * messaging.js - module to provide real-time messaging
 * Dependency:
 * socket.io,
 */
/*jslint          node : true, continue : true,
 devel  : true, indent : 2,      maxerr : 50,
 newcap : true,  nomen : true, plusplus : true,
 regexp : true, sloppy : true,     vars : false,
 white  : true
 */
/*global */
'use strict';
// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var
  socket = require( 'socket.io'),
  dongle = require( './dongle' ),
  msgObj;
// ============= END MODULE SCOPE VARIABLES ===============

// --------------- BEGIN UTILITY METHODS ------------------

// ================ END UTILITY METHODS ===================

// ---------------- BEGIN PUBLIC METHODS ------------------
msgObj = {
  connect  :  function (server, callback_list) {
    var
      io = socket.listen( server ),
      temp = '',
      temp_io = io,
      ns_io;
    // Begin to setup
    ns_io = io
      .of('/prjX')
      .on( 'connection', function ( socket ) {
        console.log(socket.id);

        // Begin /updatecolor/ message handler
        socket.on( 'User_Trigger', function ( data ) {
          console.log(data);
          console.log( temp );
          // Replace with MQTT publish
          //callback(JSON.stringify(data));
          callback_list['User_Trigger'](data, socket);
          socket.emit('Server_Trigger', 'haha');
        });
        // End /updatecolor/ message handler

        socket.on('Refresh-Device', function (data) {
          console.log(data);
          callback_list['Refresh-Device'](data, socket, temp_io);
          socket.emit('Server_Trigger', 'wow')
        });
      }
    );
    // End io setup
    return temp_io;
  }
};

module.exports = msgObj;
// ================= END PUBLIC METHODS ===================

// ------------- BEGIN MODULE INITIALIZATION --------------
// ============== END MODULE INITIALIZATION ===============