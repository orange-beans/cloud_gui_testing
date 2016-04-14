/**
 * Created by cczhang on 12/2/2015.
 */
/*
 * routes.js - module to provide
 */
/*
 * Module       : routes.js
 * Description  : to server as information router
 * Dependency   : ./messenger;
 *
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
  configRoutes,
  messenger    = require('./messenger')
  ;
// ============= END MODULE SCOPE VARIABLES ===============

// --------------- BEGIN UTILITY METHODS ------------------
// ================ END UTILITY METHODS ===================

// ---------------- BEGIN PUBLIC METHODS ------------------
/// serialPort is for testing purpose only!
//
configRoutes = function ( server, callback ) {
  // all configurations below are for routes
  //app.get( '/', function ( req, res ) {
  //  res.redirect('/index.html');
  //});

  //app.all( '/:obj_type/*?', function ( req, res, next ) {
  //  res.contentType( 'json' );
  //  next();
  //});
  //
  //app.get( '/:obj_type/list', function ( req, res ) {
  //  res.send({title : req.params.obj_type + ' list' } );
  //});
  //
  //app.post( '/:obj_type/create', function ( req, res ) {
  //
  //});
  //
  //app.get('/:obj_type/read/:id', function ( req, res ) {
  //
  //});
  //
  //app.post('/:obj_type/update/:id', function ( req, res ) {
  //
  //});
  //
  //app.get('/:obj_type/delete/:id', function ( req, res ) {
  //
  //});
  // Start socket.io messenger
  var temp_io = messenger.connect( server, callback );
  return temp_io;
};
module.exports = { configRoutes : configRoutes };
// ================= END PUBLIC METHODS ===================

// ------------- BEGIN MODULE INITIALIZATION --------------
// ============== END MODULE INITIALIZATION ===============