/**
 * Created by cczhang on 12/2/2015.
 */
/*
 * File : prjX.util.js
 * Main : prjX
 * Type : Utility module
 */
/*jslint          node : true, continue : true,
 devel  : true, indent : 2,      maxerr : 50,
 newcap : true,  nomen : true, plusplus : true,
 regexp : true, sloppy : true,     vars : false,
 white  : true
 */
/*global $, prjx */
prjX.util = (function () {
  'use strict';
//---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {},
    stateMap = {},
    jqueryMap = {},
    setJqueryMap, configModule, initModule,

    makeError, setConfigMap,

    makeTempDict, makeItemDict,

    idTools;
//================= END MODULE SCOPE VARIABLES ===============

//------------------- BEGIN UTILITY METHODS ------------------
// example : getTrimmedString


  // Helper method : /pad/
  // padding extra number with zeros;
  //
  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  // End Helper method /pad/
//==================== END UTILITY METHODS ===================

//--------------------- BEGIN DOM METHODS --------------------
// Begin DOM method /setJqueryMap/
// End DOM method /setJqueryMap/
//====================== END DOM METHODS =====================

//------------------- BEGIN EVENT HANDLERS -------------------
// example: onClickButton = ...
//==================== END EVENT HANDLERS ====================

//------------------- BEGIN PUBLIC METHODS -------------------
// Begin public method /configModule/
// Purpose   : Adjust configuration of allowed keys
// Arguments : A map of settable keys and values
//   * color_name - color to use
// Settings  :
//   * configMap.settable_map declares allowed keys
// Returns   : true
// Throws    : none
//
  configModule = function () {

  };
// End public method /configModule/

// Begin public method /initModule/
// Purpose   : Initializes module
// Arguments :
//    *  the jquery element used by this feature
// Returns   : true
// Throws    : non-accidental
//
  initModule = function () {

  };
// End public method /initModule/

// Begin Public constructor /makeError/
// Purpose: a convenience wrapper to create an error object
// Arguments:
// * name_text - the error name
// * msg_text - long error message
// * data - optional data attached to error object
// Returns : newly constructed error object
// Throws : none
//
  makeError = function ( name_text, msg_text, data ) {
    var error = new Error();
    error.name = name_text;
    error.message = msg_text;
    if ( data ){ error.data = data; }
    return error;
  };

// return public methods

// Begin Public method /setConfigMap/
// Purpose: Common code to set configs in feature modules
// Arguments:
// * input_map - map of key-values to set in config
// * settable_map - map of allowable keys to set
// * config_map - map to apply settings to
// Returns: true
// Throws : Exception if input key not allowed
//
  setConfigMap = function ( arg_map ){
    var
      input_map = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map = arg_map.config_map,
      key_name, error;
    for ( key_name in input_map ){
      if ( input_map.hasOwnProperty( key_name ) ){
        if ( settable_map.hasOwnProperty( key_name ) ){
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };
// End Public method /setConfigMap/

// Begin Public method /makeTempDict/
// create template dictionary of DOM item/stage-content pairs
  makeTempDict = function ($item_list, content_url_list) {
    var
      dict = {},
      item_id_list = [];

    for(var idx in $item_list) {
      if ($item_list.hasOwnProperty(idx)) {
        item_id_list.push($item_list[idx].attr('id'));
      }
    }

    dict = makeItemDict(item_id_list, content_url_list);
    return dict;
  };
// End Public method /makeTempDict/

// Begin Public method /makeItemDict/
// create dictionary of item/item pairs, and return the dict object,
// item can be DOM item, numbers, strings, url etc.
  makeItemDict = function (key_list, value_list) {
    var
      is_len_match,
      dict = {};
    // /verify_len/
    // Internal helper function
    // check if the two list have the same length
    is_len_match = function (a_list, b_list) {
      return a_list.length === b_list.length;
    };

    if (is_len_match(key_list, value_list)){
      for (var idx in key_list) {
        if (key_list.hasOwnProperty(idx)){
          dict[key_list[idx]] = value_list[idx];
        }
      }
      return dict;
    }
    else {
      return false;
    }
  };
// End Public method /makeItemDict/

  idTools = (function () {
    var
      long_chars  = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ",
      short_chars = "0123456789ABCDEFGHIJKLMNOPQURSTUVWXYZ",
      str_chars   = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ",

      make_id, rdm_num_str, rdm_str_num,
      random_num, random_str, random_char, random_cap, loop_cap;

    random_num = function (_len, _range) {
      if (!_range) _range = 100;
      return pad(Math.floor(Math.random() * _range) + 1, _len);
    };

    random_str = function (_len) {
      var
        _text = "";

      for( var i=0; i < _len; i++ )
        _text += str_chars.charAt(Math.floor(Math.random() * str_chars.length));

      return _text;
    };

    random_char = function () {
      return long_chars.substr( Math.floor(Math.random() * 62), 1);
    };

    random_cap = function () {
      return short_chars.substr( Math.floor(Math.random() * 36), 1);
    };

    loop_cap = function () {
      var
        _counter = 0;

    };

    make_id = function (_name_len) {
      var
        text = "";

      if(_name_len === undefined || _name_len <= 0) _name_len = 5;

      for( var i=0; i < _name_len; i++ )
        text += long_chars.charAt(Math.floor(Math.random() * long_chars.length));

      return text;
    };

    rdm_num_str = function (_num_len, _str_len, _range) {
      return random_num(_num_len, _range) + random_str(_str_len);
    };

    rdm_str_num = function (_str_len, _num_len, _range) {
      return random_str(_str_len) + random_num(_num_len, _range);
    };

    return {
      make_id     : make_id,
      rdm_num_str: rdm_num_str,
      rdm_str_num: rdm_str_num,

      random_num  : random_num,
      random_str  : random_str,
      random_char : random_char,
      random_cap  : random_cap,
      loop_cap    : loop_cap
    };
  })();

  return {
    configModule: configModule,
    initModule  : initModule,
    makeError   : makeError,
    setConfigMap: setConfigMap,

    makeTempDict: makeTempDict,
    makeItemDict: makeItemDict,

    idTools     : idTools
  };
//=================== END PUBLIC METHODS =====================
}());