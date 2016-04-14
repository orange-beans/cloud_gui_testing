/**
 * Created by HP on 22/8/2015.
 */

var cmd = (function () {
  var
    co_if, co_then;

  co_if = {
    type    : 'logic',
    raw_str : 'if',
    aft_str : 'if',
    id      : '',
    dom     : null
  };

  co_then = {
    type    : 'logic',
    raw_str : 'then',
    aft_str : 'then',
    id      : '',
    dom     : null
  }

  return {
    co_if : co_if,
    co_then : co_then
  }

})();


var device = (function () {
  var
    button, light;

  var that = this;
  button = {
    id  : 'button',

    is_pressed : function () {
      return true;
    },

    cmd_ary : [
      {
        type    : 'device_condition',
        //raw_str : that.button.id + '.' + 'pressed',
        //aft_str : that.button.id + '.' + 'pressed',
        raw_str : 'button' + '.' + 'is_pressed',
        aft_str : 'button' + '.' + 'is_pressed' + '()',
        dom     : null
      }
      , {

      }
    ]
  };

  light = {
    id  : 'light',

    on : function () {
      return true;
    },

    cmd_ary : [
      {
        type    : 'device_condition',
        //raw_str : this.light.id + '.' + 'on',
        //aft_str : this.light.id + '.' + 'on',
        raw_str : 'light' + '.' + 'on',
        aft_str : 'light' + '.' + 'on' + '()',
        dom     : null
      }
      , {

      }
    ]
  };

  return {
    button: button,
    light : light
  }

})();
