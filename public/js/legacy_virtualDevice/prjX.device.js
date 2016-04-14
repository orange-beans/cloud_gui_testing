/**
 * Created by cczhang on 25/8/2015.
 */
var device, devices = {};

var lan = {
  str_raw : '',
  to_table: ''
};

// Dependencies
// prjX.util.js
var
  util  = prjX.util,
  idGen = prjX.util.idTools,
  Dom_module = prjX.Dom_Module;

// Virtual Device prototypes
//
var V_Device = function(_input_map) {

  var
    _v_device, _added_feature,
    _id,
    _config_map = {
      main_html: String()
               + '<div id="" class="" style="position:relative;outline:solid;float: left;height:120px;width:160px;">'
               +   '<div class="module-closer"><span style="vertical-align:middle;display: inline-block;margin-left: 25%">Default</span></div>'
               +   '<div class="module-closer"><span style="text-align:center;vertical-align:middle;display: inline-block;"></span></div>'
               +   '<button class="btn btn-default" style="margin-left: 20%;margin-top:5%">Default</button>'
               + '</div>',
      class    : 'v_device',
      id       : '',
      //pre_func : null,
      //rd_func  : null,
      name     : ''
    },
    _settable_map = {
      main_html: true,
      class    : true,
      name     : true
    //pre_func : true,
    //rd_func  : true
    },

    configModule,

    // Basic Public Device methods
    //getName, changeName,
    makeEvent,
    // Helper Functions
    // register events into events table
    // remove events from events table
    //
    updateEList, events_list = {}, register_events, clear_events,
    create, destroy;

  // Configure Module according to different devices.
  configModule = function (input_map) {
    prjX.util.setConfigMap({
      input_map   : input_map,
      settable_map: _settable_map,
      config_map  : _config_map
    });
    return true;
  };

  if (_input_map !== undefined) configModule(_input_map);

  // Generate a random module id if _module_id is undefined
  //
  if( _config_map.id === '' ) {
    _config_map.id = _config_map.class + '_' + idGen.random_num(3, 100);
  }

  if (_config_map.name === undefined ) _config_map.name = _config_map.id;

  _v_device = Dom_module(_config_map);
  _id = _v_device.getId();


  // Functions Specified for virtual devices
  //
  makeEvent = function (_device_id, _event_name, _condition, _delay) {
    var
      delay = _delay || 100,
      tmp;

    if(delay <= 0) {
      amplify.publish('test-event', {
        'id'          : _device_id,
        'event_name'  : _event_name,
        'condition'   : _condition
      });
    }

    else {
      tmp = setTimeout(function () {
        amplify.publish('test-event', {
          'id'          : _device_id,
          'event_name'  : _event_name,
          'condition'   : _condition
        });
        clearTimeout(tmp);
      }, delay);
    }
  };

  updateEList = function (_condition_map) {
    // Set up events name according to device name and _condition map
    //
    $.each(_condition_map, function(key, val) {
      events_list[_id + key] = val;
    });
  };

  register_events = function () {
    // Extend the events table:
    jQuery.extend(device.router.table, events_list);
  };

  clear_events = function () {
    Object.keys(events_list).forEach(function(entry) {
      delete device.router.table[entry];
    });
  };

  create = function ($target) {
    register_events();

    // Put this device into Devices Group
    // for easy access
    devices[_id] = _v_device;

    _v_device.init($target);
    _v_device.attach();
  };

  destroy = function () {
    _v_device.remove();
    clear_events();
    // Delete this device into Devices Group
    delete devices[_id];
    _v_device = {};
  };


  // Public virtual device DOM methods
  // && common methods
  //
  _added_feature = {
    configModule: configModule,

    makeEvent   : makeEvent,
    create      : create,
    destroy     : destroy,

    updateEList : updateEList
  };

  jQuery.extend(_v_device, _added_feature);

  return _v_device;
};

// Virtual Device LOGIC
// this is a object created from V_Device
//
var V_Logic = function (name) {
  var
    _device, _added_feature,
    _id,
    _dom_map = {},
    _input_map = {
      main_html: String(),
      class    : 'v_logic',
      name     : name
    },

  // Array of function objects and
  // condition objects to passed into Cmd_Btn
  // to generate control buttons
  //
    func_ary = [],
    cond_ary = [
      { name      : 'if',
        func_str  : '\r\nif ',
        disp_str  : '\r\nif '
      },

      { name      : 'else',
        func_str  : '\r\nelse ',
        disp_str  : '\r\nelse '
      },

      { name      : 'not',
        func_str  : 'not ',
        disp_str  : 'not '
      },

      { name      : 'and',
        func_str  : 'and ',
        disp_str  : 'and '
      },

      { name      : 'or',
        func_str  : 'or ',
        disp_str  : 'or '
      }
    ];

  _device = V_Device(_input_map);
  _id = _device.getId();
  _dom_map = {
    $dom      : _device.getDom(),
    $name     : _device.getDom().find('.name')
  };
  _dom_map.$name.text(_device.getName());

  // Expose Public Functions:
  //
  _device.func_ary = func_ary;
  _device.cond_ary = cond_ary;

  _device.btn = Test_btn(_device);

  return _device;
};

// Virtual Device Button
// this is a object created from V_Device
//
var V_Button = function (name) {
  var
    _device, _added_feature,
    _id,
    _dom_map = {},
    _input_map = {
      main_html: String()
               + '<div id="dev_button_A" class="" style="position:relative;outline:solid;float: left;height:120px;width:160px;">'
               +   '<div class="module-closer"><span class="name" style="vertical-align:middle;display: inline-block;margin-left: 25%">Button A</span></div>'
               +   '<div class="module-closer"><span style="text-align:center;vertical-align:middle;display: inline-block;"></span></div>'
               +   '<button class="btn btn-default" style="margin-left: 20%;margin-top:5%">智能按键</button>'
               + '</div>',
      class    : 'v_button',
      name     : name
    },
    _condition_map = {
      _is_pressed : false,
      _is_clicked : false
    },


    // Array of function objects and
    // condition objects to passed into Cmd_Btn
    // to generate control buttons
    //
    func_ary = [],
    cond_ary = [
      { name      : 'is pressed',
        func_str  : '@is_pressed#',
        disp_str  : '@is pressed#'
      },

      { name      : 'is released',
        func_str  : '!@is_pressed#',
        disp_str  : '@is released#'
      },

      {
        name      : 'is clicked',
        func_str  : '@is_clicked#',
        disp_str  : '@is clicked#'
      }
    ],
    // conditions
    //
    _is_pressed, _is_released,
    _is_clicked;

  _device = V_Device(_input_map);
  _id = _device.getId();
  _dom_map = {
    $dom      : _device.getDom(),
    $name     : _device.getDom().find('.name'),
    $button   : _device.getDom().find('button')
  };
  _dom_map.$name.text(_device.getName());

  _device.updateEList(_condition_map);

  // Devices Functions
  //
  _is_clicked = function () {
    return true;
  };

  _is_pressed = function () {
    _condition_map._is_pressed = true;
    _device.makeEvent(_id, '_is_pressed', true, 0);
  };

  _is_released = function () {
    _condition_map._is_pressed = false;
    _device.makeEvent(_id, '_is_pressed', false, 0);
  };

  // Register Device events with DOMs
  //
  // Button is clicked
  _dom_map.$button.on('click', function () {
    _is_clicked();
  });
  // Button is being pressed down
  _dom_map.$button.on('mousedown', function () {
    _is_pressed();
  });
  // Button has been released
  _dom_map.$button.on('mouseup', function () {
    _is_released();
  });

  // Expose Public Functions:
  //
  _device.is_pressed = _is_released;
  _device.func_ary = func_ary;
  _device.cond_ary = cond_ary;

  format(_device, func_ary, cond_ary);

  _device.btn = Test_btn(_device);

  return _device;
};

// Virtual Device Light
// this is a object created from V_Device
//
var V_Light = function (name) {
  var
    _device,
    _id,
    _dom_map = {
      $dom    : null,
      $circle : null
    },
    _color_map = {
      white : 'rgb(255, 255, 255)',
      grey  : 'rgb(128, 128, 128)',
      red   : 'rgb(220, 20, 60)',
      orange: 'rgb(255, 140, 0)',
      yellow: 'rgb(255, 255, 51)',
      green : 'rgb(50, 205, 50)',
      blue  : 'rgb(30, 144, 255)',
      cyan  : 'rgb(0, 255, 255)',
      purple: 'rgb(148, 0, 211)'
    } ,
    _input_map = {
      main_html: String()
               + '<div id="dev_light_A" class="" style="position:relative;outline:solid;float: left;height:120px;width:160px;">'
               +   '<div class="module-closer"><span class="name" style="vertical-align:middle;display: inline-block;margin-left: 25%">LED A</span></div>'
               +   '<label for="hidden-input"></label>'
               +   '<div class="circle"></div>'
               + '</div>',
      class    : 'v_light',
      name     : name
    },
    _condition_map = {
      _is_on  : false
    },

    func_ary = [],
    cond_ary = [],
  // Device Function
  // Conditions
  //
    _on, _off, _toggle,
    _is_on, _is_off;

  _device = V_Device(_input_map);
  _id = _device.getId();
  _dom_map = {
    $dom     : _device.getDom(),
    $name     : _device.getDom().find('.name'),
    $circle  : _device.getDom().find('.circle')
  };
  _dom_map.$name.text(_device.getName());

  // Set up events name according to device name and _condition map
  //
  _device.updateEList(_condition_map);

  // Devices Functions
  //
  _is_on = function () {
    if (_dom_map.$circle.css('background-color') !== _color_map['grey']) return true;
    return false;
  };

  _is_off = function () {
    if (_dom_map.$circle.css('background-color') === _color_map['grey'] ) return true;
    return false;
  };

  _on = function (color) {
    if (color) {
      _dom_map.$circle.css('background-color', _color_map[color]);
    }
    else _dom_map.$circle.css('background-color', _color_map['white']);
    // Note that the events cannot be nested!!!!
    // added a short delay before emitting the event
    //
    //_device.makeEvent(_id, '_is_on', true, 0);
  };

  _off = function () {
    _dom_map.$circle.css('background-color', _color_map['grey']);
    //_device.makeEvent(_id, '_is_on', false, 0);
  };

  _toggle = function () {
    if (_is_on()) return _off();
    if (_is_off()) return _on();
  };

  // Register Device events
  //
  // Light is on / off
  //
  // in _on _off functions


  // Expose Public Functions:
  //
  _device.on     = _on;
  _device.off    = _off;
  _device.toggle = _toggle;

  _device.func_ary = [
    // On
    {
      name    : 'on',
      func_str: '@on()#',
      disp_str: '@on#'
    },
    // Off
    {
      name    : 'off',
      func_str: '@off()#',
      disp_str: '@off#'
    },
    // toggle
    {
      name    : 'toggle',
      func_str: '@toggle()#',
      disp_str: '@toggle#'
    }
  ];
  _device.cond_ary = [];

  format(_device, _device.func_ary, _device.cond_ary);

  _device.btn = Test_btn(_device);

  return _device;
};

////////////////////////////////////////
device = (function() {
  var
    config_map = {
      dom    : $(),
      dom_map: null
    },
    init,
    router;

  init = function(_target) {
    _target.append()
  };

  router = (function() {
    var
      test_table = {};

    amplify.subscribe('test-event', function(event_obj) {
      //console.log(event_msg);
      var event_name = event_obj['id'] + event_obj['event_name'];

      if (test_table.hasOwnProperty(event_name)) {
        test_table[event_name] = event_obj['condition'];
      }

      amplify.publish('test-table-changed', 999);
      console.log(test_table);
    });

    return {
      table : test_table
    }
  })();

  return {
    init     : init,
    dom      : config_map.dom,
    router   : router
  };
})();


// Helper function
// to format func strings and condition strings
//
function format (obj, func_ary, cond_ary) {
  var
    _name = obj.getName(),
    _id   = obj.getId();

  $.each(func_ary, function(idx, val) {
    val.func_str = val.func_str.replace('@', 'devices.'
                                             + obj.getId() + '.')
      .replace('#', ' ');

    val.disp_str = val.disp_str.replace('@', obj.getName() + ' ')
      .replace('#', ' ');
  });

  $.each(cond_ary, function(idx, val) {
    val.func_str = val.func_str.replace('@', 'device.router.table["'
                                          + obj.getId() + '_')
      .replace('#', '"]');
    val.disp_str = val.disp_str.replace('@', obj.getName() + ' ')
      .replace('#', ' ');
  });
}