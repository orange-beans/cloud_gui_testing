/**
 * Created by HP on 14/2/2015.
 */
/*
 * Module       : dongle.js
 * Description  : to provide protocol to communicate
 *                with dongle;
 * Dependency   : ./utility;
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
  util = require( './utility' ),
  cmdObj,
  parseRGB;
// ============= END MODULE SCOPE VARIABLES ===============

// --------------- BEGIN UTILITY METHODS ------------------
// Begin Utility Method /parseRGB/
parseRGB = function ( rgb_string ) {
  var _rgb_value;
  _rgb_value = util.parseToInt(rgb_string.replace(/[a-z()]/gi, '')
      .split(','), 10);
  return _rgb_value;
};
// End Utility Method /parseRGB/
// ================ END UTILITY METHODS ===================

// ---------------- BEGIN PUBLIC METHODS ------------------
cmdObj = (function () {
  var
    cmd_map, cmd_body,
    create_cmd,
    fetch_cmd;

  cmd_map = {
    header  : [0x24, 0x40],
    size    : 0x00,   // These are the CRC load
    target  : 0x01,   //  // These are the length load
    source  : 0x00,   //  //
    cmd     : 0x00,   //  //
    cmd_load: [],     //  //
    crc_byte: [],
    tail    : 0x23
  };

  cmd_body = [];

 // create_cmd =function ( tgt, cmd, load ) {
  create_cmd =function ( cmd_packet ) {
    var
      _cmd_body = [],
      _crc_load = [],
      _len_load = [],
      _cmd_size = [],
      _crc_byte = [];

    var temp_load;

    if(cmd_packet.cmd == 7) {
      temp_load = parseRGB(cmd_packet.lod);
    }
    if (cmd_packet.cmd == 5) {
      temp_load =[0,0];
    }
    if (cmd_packet.cmd == 4) {
      temp_load = cmd_packet.lod;
    }
    // Find effective load array
    _len_load = _len_load.concat(
      //cmd_map.target,
      cmd_packet.tgt,
      cmd_map.source,
      cmd_packet.cmd,
      //parseRGB(load)
      temp_load
    );
    _cmd_size = _len_load.length;
    // Find CRC load array
    _crc_load = _crc_load.concat(_cmd_size, _len_load);
    _crc_byte = util.checkCRC(_crc_load, 0, _crc_load.length);
    // Find the overall array
    _cmd_body = _cmd_body.concat(
      cmd_map.header,
      _crc_load,
      _crc_byte,
      cmd_map.tail
    );
    cmd_body = _cmd_body;
    return _cmd_body;
  };

  fetch_cmd = function () {
    return cmd_body;
  };

  return {
    create_cmd : create_cmd,
    fetch_cmd  : fetch_cmd
  };
}());

module.exports = cmdObj;
// ================= END PUBLIC METHODS ===================

// ------------- BEGIN MODULE INITIALIZATION --------------
// ============== END MODULE INITIALIZATION ===============