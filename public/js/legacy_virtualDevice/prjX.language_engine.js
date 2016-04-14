/**
 * Created by cczhang on 6/8/2015.
 */
var lan_engine;

// This is the temp lib to handle the cleaned strings, supposed the string has already been dealt with;
//

$(function() {

  // Need a factory function to generate these str_array objects
  //
  lan_engine = function(str_array_obj) {
    var _obj = str_array_obj;
    var _array;

    _array = _obj['str_array'].toLowerCase().split(' ');

    return _array;
  };

});