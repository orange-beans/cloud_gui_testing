/**
 * Created by HP on 14/2/2015.
 */
/*
 * Module       : utility.js
 * Description  : to provide common usage utilities;
 * Dependency   :
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
  parseToInt, parseToStr,
  checkCRC;
// ============= END MODULE SCOPE VARIABLES ===============

// --------------- BEGIN UTILITY METHODS ------------------

// ================ END UTILITY METHODS ===================

// ---------------- BEGIN PUBLIC METHODS ------------------
// Begin Public Utility Method /checkCRC/
// Purpose   : CRC_CCITT check of a array
// Arguments : A map of package information
//   *
// Returns   : An array of two bytes CRC
// Throws    : none
checkCRC = function ( int_array, offset, byte_no ) {
  var
    i, j,
    crc_16,
    crc_result = [];

  crc_16 = 0x0000;

  for ( i = 0; i < byte_no; i++ ) {
    crc_16 ^= int_array[i + offset]; // ^ is exclusive OR
    for ( j = 0; j < 8; j++ ) // test each bit in the byte
    {
      if ( (crc_16 & 0x0001) !== 0x0000 ) {
        crc_16 >>= 1;
        crc_16 ^= 0x8408; // polynomial x^16 + x^12 + x^5 + 1
      } else {
        crc_16 >>= 1;
      }
    }
  }
  crc_result[0] = crc_16 >> 8;
  crc_result[1] = crc_16 & 0x00ff;

  return crc_result;
};
// End Public Utility Method /checkCRC/

// Begin Public Utility Method /parseToInt/
// parse string array to int
parseToInt = function ( array, num ) {
  var i, _new_array = [];
  for ( i=0; i < array.length; i++ ) {
    _new_array[i] = parseInt(array[i], num);
  }
  return _new_array;
};
// End Public Utility Method /parseToInt/

// Begin Public Utility Method /parseToStr/
// parse int array to string
parseToStr = function ( array, num ) {
  var i, _new_array = [];
  for ( i=0; i < array.length; i++ ) {
    _new_array[i] = array[i].toString(num);
  }
  return _new_array;
};
// End Public Utility Method /parseToStr/

module.exports = {
  checkCRC    : checkCRC,
  parseToInt  : parseToInt,
  parseToStr  : parseToStr
};
// ================= END PUBLIC METHODS ===================

// ------------- BEGIN MODULE INITIALIZATION --------------
// ============== END MODULE INITIALIZATION ===============