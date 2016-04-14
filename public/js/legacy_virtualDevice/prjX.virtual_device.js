/**
 * Created by cczhang on 1/9/2015.
 */

var lan = {
  str_ary : [],
  fuc_ary : [],
  lan_ary : [],
  //lang    : 'cn',
  lang    : 'en'
};

//prjX.virtual_device = (function () {
var vdev = (function () {
  var
    // Important names
    // for script execution
    //
    module_name = 'vdev',
    dev_event   = 'v-dev-event',
    tab_event   = 'v-dev-table',

    devices = {},
    Dom_module = prjX.Dom_Module,
    util  = prjX.util,
    idGen = prjX.util.idTools,

    // Factory functions
    //
    V_Device,
    router, V_Router,
    V_Logic,
    V_Button, V_Light, V_Music, V_Gyro;

  //------------------- BEGIN Help METHODS -------------------
  // Begin helper method /format/
  // Purpose   : format the function array and condtion array
  // Arguments :
  //
  function XXformat(obj, obj_template) {
    var
      _name = obj.getName(),
      _id = obj.getId();

    // create a copy of corresponding device function object
    //
    if (!obj.f_obj) {
      obj.f_obj = jQuery.extend(true, {}, obj_template)
    }

    // update display & function strings for action array
    //
    $.each(obj_template["actions"], function (idx, _obj) {

      obj.f_obj["actions"][idx]["func_str"] =
      _obj["func_str"].replace(
        '(@', module_name + '.devices.' + _id + '.')
        .replace('#)', ' ');

      obj.f_obj["actions"][idx]["disp_str"] =
      _obj["disp_str"].replace(
        '(@', _name + ' ')
        .replace('#)', ' ');
    });

    $.each(obj_template["conditions"], function (idx, _obj) {

      obj.f_obj["conditions"][idx]["func_str"] =
      _obj["func_str"].replace(
        '(@', module_name + '.router.table["' + _id + '_')
        .replace('#)', '"]');

      obj.f_obj["conditions"][idx]["disp_str"] =
      _obj["disp_str"].replace(
        '(@', _name + ' ')
        .replace('#)', ' ');
    });
    // End
  }
  // END /format/

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public Factory method /V_Device/
  // Purpose   : Create a virtual Devices, this is an prototype of /Dom_Module/
  // Arguments : A map of settable keys and values
  //
  V_Device = function(_input_map) {

    var
      _v_device, _added_feature,
      _id,
      _dom_map = {},
      _config_map = {
        main_html: String()
                 + '<div id="" class="" style="position:relative;outline:solid;float: left;height:120px;width:160px;">'
                 +   '<div class="module-closer"><span style="vertical-align:middle;display: inline-block;margin-left: 25%">Default</span></div>'
                 +   '<div class="name-adder"><span style="text-align:center;vertical-align:middle;display: inline-block;margin-left:25%"></span>change</div>'
                 +   '<button class="btn btn-default" style="margin-left: 20%;margin-top:5%">Default</button>'
                 + '</div>',
        class    : 'v_device',
        type     : 'Virtual Device',
        id       : '',
        //pre_func : null,
        rd_func  : null,
        name     : ''
      },
      _settable_map = {
        main_html: true,
        class    : true,
        name     : true,
        type     : true,
        //pre_func : true,
        rd_func  : true
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
      _get_type,
      _consume,
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
      //_config_map.id = _config_map.class + '_' + idGen.random_num(3, 100);
      _config_map.id = _config_map.class + '_' + idGen.rdm_str_num(2,3);
    }

    if (_config_map.name === undefined ) _config_map.name = _config_map.id;

    // create device
    _v_device = Dom_module(_config_map);
    _id = _v_device.getId();

    // DOM map for the common DOMs
    //
    _dom_map = {
      $dom      : _v_device.getDom(),
      $name     : _v_device.getDom().find('.name'),
      $rename   : _v_device.getDom().find('.name-changer').find('input'),
      $closer   : _v_device.getDom().find('.module-closer'),
      $battery  : _v_device.getDom().find('.progress-bar')
    };
    // Set device dom name
    //
    _dom_map.$name.text(_v_device.getName());

    // Functions Specified for virtual devices
    //
    makeEvent = function (_event_name, _condition, _delay) {
      var
        _device_id = _id,
        delay = _delay || 100,
        tmp;

      if(delay <= 0) {
        amplify.publish(dev_event, {
          'id'          : _device_id,
          'event_name'  : _event_name,
          'condition'   : _condition
        });
      }

      else {
        tmp = setTimeout(function () {
          amplify.publish(dev_event, {
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
      jQuery.extend(vdev.router.table, events_list);
    };

    clear_events = function () {
      Object.keys(events_list).forEach(function(entry) {
        delete vdev.router.table[entry];
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

    // consume battery
    //
    // **************Clean This out!!!!*******
    //
    var _consume_flag;

    // Clear blink if the interval exists
    var _clear_consume = function () {
      if (_consume_flag) {
        clearInterval(_consume_flag);
      }
    };

    var _consume_still = function (_state_map, _pow) {
      _clear_consume();
      _consume_flag = setInterval(function () {
        _consume(_state_map, _pow);
      }, 500);
    };

    _consume = function (_state_map, _pow) {
      if(_state_map.battery >= 0) _state_map.battery -= _pow;

      if(_state_map.battery < 20 && _dom_map.$battery.hasClass('progress-bar-warning')) {
        _dom_map.$battery.removeClass('progress-bar-warning');
        _dom_map.$battery.addClass('progress-bar-danger');
      }

      if(_state_map.battery >=20 && _state_map.battery <= 35 && _dom_map.$battery.hasClass('progress-bar-success')) {
        _dom_map.$battery.removeClass('progress-bar-success');
        _dom_map.$battery.addClass('progress-bar-warning');
      }
      _dom_map.$battery.css('width', _state_map.battery+'%')
        .attr('aria-valuenow', _state_map.battery);
    };
    // end of consume battery
    //
    // **************Clean This out!!!!*******
    //


    _get_type = function () {
      return _config_map.type;
    };
    // Register Device events with DOMs
    // move this to the v_device factory
    //
    // Closer module
    _dom_map.$closer.on('click', function () {
      _v_device.btn.destroy();
      _v_device.destroy();
    });
    //
    // Rename module
    _dom_map.$rename.keyup(function(event){
      if(event.keyCode == 13){
        if(_dom_map.$rename.val() !== '') {
          var _name = _dom_map.$rename.val();
          _v_device.changeName(_name);
          XXformat(_v_device, window.test[_config_map.class]);
          _v_device.btn.changeName(_name);
          _dom_map.$rename.val('');
        }
      }
    });

    // Public virtual device DOM methods
    // && common methods
    //
    _added_feature = {
      configModule: configModule,

      makeEvent   : makeEvent,
      create      : create,
      destroy     : destroy,

      getType     : _get_type,

      consume     : _consume,
      consume_still : _consume_still,
      consume_clear : _clear_consume,

      updateEList : updateEList
    };

    jQuery.extend(_v_device, _added_feature);

    //
    // Format the function strings and display strings
    // create Cmd_Btn
    //
    XXformat(_v_device, window.test[_config_map.class]);
    _v_device.btn = Cmd_Btn(_v_device);

    return _v_device;
  };

  V_Router = function() {
    var
      _device, _added_feature,
      _id,
      _state_map = {},
      _dom_map = {
        $dom    : null
      },
      _input_map = {
        main_html: String()
                 + '<div id="dev_router_AB" class="" style="">'
                 +   '<div><label class="name" style="vertical-align:middle;display: inline-block;margin-left: 5%;" for="hidden-input">'
                 +     'router</label></div>'
                 +   '<div class="" style="position:absolute;padding:0;top:0;right:20px;"><span style="vertical-align:middle;display: inline-block;margin-left: 25%"><img src="../rs/img/Logo155.png" alt="Smiley face" height="30" width=71.4"></span></div>'
                 +   '<div class="name-changer" style="margin-left: 5%;"><input type="text" size="7"></div>'
                 +   '<div class="v-clock" style="white-space: pre-wrap;vertical-align:middle;margin-left: 5%;margin-top:10%"></div>'
                 + '</div>',
        class    : 'v_router',
        name     : 'Fabae',
        type     : 'A router'
        //rd_func  :  function () {
        //  $( ".v_button" ).draggable();
        //}
      },
      _condition_map = {
        _wait_5  : false
      },
      test_table = {},
      // Functions
      _wait
      ;

    _device = V_Device(_input_map);
    _id = _device.getId();
    // Configure doms
    _dom_map = {
      $dom       : _device.getDom(),
      $clock     : _device.getDom().find('.v-clock')
    };

    _dom_map.$clock.timeTo({
      fontSize : 18
    });
    _device.updateEList(_condition_map);
    // Events table subscription
    //
    amplify.subscribe(dev_event, function(event_obj) {
      //console.log(event_msg);
      var event_name = event_obj['id'] + event_obj['event_name'];

      if (test_table.hasOwnProperty(event_name)) {
        test_table[event_name] = event_obj['condition'];
      }

      amplify.publish(tab_event, 999);
      console.log(test_table);
    });

    // Expose Public Functions:
    //
    _wait = function (_duration) {
      setTimeout(function(){
        _device.makeEvent(_id, '_wait_' + _duration, true);
        _device.makeEvent(_id, '_wait_' + _duration, false);
      }, _duration);
    };

    // Format and Cmd_Btn can be written as
    // common methods of virtual devices
    //
    //_device.format = function () {
    //  XXformat(_device,  window.test["v_router"]);
    //};
    //_device.format();
    //
    //_device.btn = Cmd_Btn(_device);

    _added_feature = {
      table : test_table,
      wait  : _wait
    };

    jQuery.extend(_device, _added_feature);
    vdev.router = _device;
    return _device;
  };

  // Virtual Device LOGIC
  // this is a object created from V_Device
  //
  V_Logic = function (name) {
    var
      _device, _added_feature,
      _dom_map = {},
      _input_map = {
        main_html: String(),
        class    : 'v_logic',
        name     : name,
        type     : 'A Logic'
      };

    _device = V_Device(_input_map);
    _dom_map = {
      $dom      : _device.getDom()
    };
    // Expose Public Functions:
    //
    return _device;
  };

  // Begin public Factory method /V_Button/
  // Purpose   : Create a virtual Button, this is an prototype of /V_Device/
  // Arguments : A name of the virtual Button
  //
  V_Button = function (name) {
    var
      _device, _added_feature,
      _id,
      _state_map = {
        battery : 100
      },
      _dom_map = {},
      _input_map = {
        main_html: String()
                 + '<div id="dev_button_A" class="" style="">'
                 +   '<div><label class="name" style="" for="hidden-input">'
                 +     'Button A</label></div>'
                 +   '<div class="module-closer"><span style="vertical-align:middle;display: inline-block;margin-left: 25%"></span></div>'
                 +   '<div class="name-changer" style="margin-left: 5%;"><input type="text" size="7"></div>'
                 +   '<button class="btn btn-default" style="margin-left: 20%;margin-top:5%;white-space: pre-wrap;background-color: darkgrey">        </button>'
                 +   '<div class="progress battery-bar" style="">'
                 +     '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">'
                 +     '</div>'
                 +   '</div>'
                 + '</div>',
        class    : 'v_button',
        name     : name,
        type     : 'Button'
      },
      _condition_map = {
        _is_pressed : false,
        _is_clicked : false
      },

    // v_button Conditions
    //
      _is_pressed, _is_released,
      _is_clicked;

    _device = V_Device(_input_map);
    _dom_map = {
      $button   : _device.getDom().find('button')
    };


    // Put update list into v-device factory
    _device.updateEList(_condition_map);

    // v_button Conditions
    //
    _is_clicked = function () {
      return true;
    };

    _is_pressed = function () {
      _condition_map._is_pressed = true;
      _device.makeEvent('_is_pressed', true, 0);
    };

    _is_released = function () {
      _condition_map._is_pressed = false;
      _device.makeEvent('_is_pressed', false, 0);
    };
    // End v_button conditions

    // Register Device events with DOMs
    //
    // Button is clicked
    _dom_map.$button.on('click', function () {
      _is_clicked();
    });
    // Button is being pressed down
    _dom_map.$button.on('mousedown', function () {
      _is_pressed();

      // consume battery
      _device.consume(_state_map, 1);
      if(_state_map.battery <=1) _dom_map.$dom.attr('disabled', 'disabled');
    });
    // Button has been released
    _dom_map.$button.on('mouseup', function () {
      _is_released();
    });
    // End DOM events register


    // Expose Public Functions:
    //

    return _device;
  };

  // Begin public Factory method /V_Light/
  // Purpose   : Create a virtual Light, this is an prototype of /V_Device/
  // Arguments : A name of the virtual Light
  //
  V_Light = function (name) {
    var
      _device, _added_feature,
      _state_map = {
        color : 'white',
        battery : 100
      },
      _dom_map = {
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
                 + '<div id="dev_light_A" class="" style="">'
                 +   '<div><label class="name" style="vertical-align:middle;display: inline-block;margin-left: 5%;" for="hidden-input">'
                 +     'Light A</label></div>'
                 +   '<div class="progress battery-bar" style="">'
                 +     '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%;">'
                 +     '</div>'
                 +   '</div>'
                 +   '<div class="module-closer"><span style="vertical-align:middle;display: inline-block;margin-left: 25%"></span></div>'
                 +   '<div class="name-changer" style="margin-left: 5%;"><input type="text" size="7"></div>'
                 +   '<div class="circle"></div>'
                 + '</div>',
        class    : 'v_light',
        name     : name,
        type     : 'Light'
      },
      _condition_map = {
        _is_on  : false
      },

    // Device Functions and Conditions
    //
      _clear_blink,
      _on, _off, _toggle, _blink,
      _is_on, _is_off;

    _device = V_Device(_input_map);
    _dom_map = {
      $circle   : _device.getDom().find('.circle')
    };

    // Set up events name according to device name and _condition map
    //
    _device.updateEList(_condition_map);

    // v_light helper methods
    //
    // Clear blink if the interval exists
    _clear_blink = function () {
      if (_state_map.blink) {
        clearInterval(_state_map.blink);
      }
    };
    // End v_light methods

    // v_light conditions
    //
    _is_on = function () {
      if (_dom_map.$circle.css('background-color') !== _color_map['grey']) return true;
      return false;
    };

    _is_off = function () {
      if (_dom_map.$circle.css('background-color') === _color_map['grey'] ) return true;
      return false;
    };
    // End v_light conditions

    // v_light functions
    //
    _on = function (color) {
      _clear_blink();
      _device.consume_still(_state_map, 0.2);
      if(_state_map.battery <=1) _dom_map.$dom.attr('disabled', 'disabled');
      if (color) {
        _dom_map.$circle.css('background-color', _color_map[color]);
        _state_map.color = color;
      }
      else
      {
        _dom_map.$circle.css('background-color', _color_map['white']);
        _state_map.color = 'white';
      }

      //_device.makeEvent(_id, '_is_on', true, 0);
    };

    _off = function () {
      _clear_blink();
      _device.consume_clear();
      _dom_map.$circle.css('background-color', _color_map['grey']);
      //_device.makeEvent(_id, '_is_on', false, 0);
    };

    _toggle = function () {
      //_clear_blink();
      if (_is_on()) return _off();
      if (_is_off()) return _on(_state_map.color);
    };

    _blink = function (_delay) {
      _clear_blink();
      _state_map.blink = setInterval(function () {
        if (_is_on()) {
          return _dom_map.$circle.css('background-color', _color_map['grey']);
        }
        if (_is_off()) {
          return _dom_map.$circle.css('background-color', _color_map[_state_map.color]);
        }
      }, _delay);
    };
    // End v_light functions

    // Expose Public Functions:
    //
    _added_feature = {
      on    :   _on,
      off   :   _off,
      toggle:   _toggle,
      blink :   _blink
    };
    jQuery.extend(_device, _added_feature);
    // End

    return _device;
  };

  // Begin public Factory method /V_Music/
  // Purpose   : Create a virtual Music, this is an prototype of /V_Music/
  // Arguments : A name of the virtual Music
  //
  V_Music = function (name) {
    var
      _device, _added_feature,
      _dom_map = {},
      _state_map = {
        battery : 100
      },
      _counter = 0,
      _song_list = [
        '../rs/audio/01.self.mp3',
        '../rs/audio/02.memory.mp3',
        '../rs/audio/03.wukong.mp3',
        '../rs/audio/04.achu.mp3',
        '../rs/audio/05.wind.mp3',
        '../rs/audio/06.lovesong.mp3',
        '../rs/audio/07.onyourshoulder.mp3',
        '../rs/audio/08.makeyouhappy.mp3',
        '../rs/audio/09.goodolddays.mp3',
        '../rs/audio/10.welcome.mp3'
      ],
      _input_map = {
        main_html: String()
                 + '<div id="dev_Music_A" class="" style="">'
                 +   '<div><label class="name" style="vertical-align:middle;display: inline-block;margin-left: 5%;" for="hidden-input">'
                 +     'Music A</label></div>'
                 +   '<div class="progress battery-bar" style="">'
                 +     '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%;">'
                 +     '</div>'
                 +   '</div>'
                 +   '<div class="module-closer"><span style="vertical-align:middle;display: inline-block;margin-left: 25%"></span></div>'
                 +   '<div class="name-changer" style="margin-left: 5%;"><input type="text" size="7"></div>'
                 +   '<audio controls style="width: 95%;margin-left: 2.5%;margin-top:18%">'
                 +     '<source src="../rs/audio/01.self.mp3" type="audio/mpeg">'
                 +       'Your browser does not support the audio element.'
                 +   '</audio>'
                 + '</div>',
        class    : 'v_music',
        name     : name,
        type     : 'Music'
      },
      _condition_map = {
        _is_playing : false
      },

      // helpers
      _current_song,
      // conditions
      //
      _is_playing,
      // functions
      //
      _toggle,
      _play, _pause, _stop, _next, _prev;

    _device = V_Device(_input_map);
    _dom_map = {
      $player   : _device.getDom().find('audio')
    };

    _device.updateEList(_condition_map);

    // v_music Helper methods
    //
    _current_song = function () {
      return parseInt(_dom_map.$player
        .find('source').attr('src').match(/\d+/)[0]);
    };
    // End v_music Helper methods

    // v_music Conditions
    //
    _is_playing = function () {
      return !_device.getDom().find('audio')[0].paused;
    };
    // End v_music Conditions

    // v_music Functions
    //
    _toggle = function () {
      if ( _is_playing() ) {
        _pause();
      }
      else {
        _play();
      }
    };

    _play = function (_num) {
      _device.consume_still(_state_map, 0.25);
      if(_state_map.battery <=1) _dom_map.$dom.attr('disabled', 'disabled');
      if(_num) {
        _dom_map.$player.find('source').attr({src:_song_list[_num-1]});
        // put rewind after change the src, otherwise the player
        // will reload previous song
        _stop();
        setTimeout(function () {
          _dom_map.$player.trigger('play');
        }, 1000);
      }
      else _dom_map.$player.trigger('play');
      return _current_song();
    };

    _next = function () {
      var _tmp = _current_song();
      _play(_tmp + 1);
      return _tmp;
    };

    _prev = function () {
      var _tmp = _current_song();
      _play(_tmp - 1);
    };

    _pause = function () {
      _dom_map.$player.trigger('pause');
      _device.consume_clear();
    };

    _stop = function () {
      _dom_map.$player.trigger('load');
      _device.consume_clear();
    };
    // End v_music Functions


    // Register Device events with DOMs
    //
    // End

    // Expose Public Functions:
    //
    _added_feature = {
      play   :   _play,
      next   :   _next,
      prev   :   _prev,
      pause  :   _pause,
      stop   :   _stop,
      toggle :   _toggle
    };
    jQuery.extend(_device, _added_feature);
    // End

    return _device;
  };

  // Begin public Factory method /V_Gyro/
  // Purpose   : Create a virtual Gyro, this is an prototype of /V_Device/
  // Arguments : A name of the virtual Gyro
  //
  V_Gyro = function (name) {
    var
      _device, _added_feature,
      _state_map = {
        shake_speed : 0,
        threshold   : 800,
        threshold_hard : 2000,
        battery     : 100
      },
      _dom_map = {},
      _input_map = {
        main_html: String()
                 + '<div id="dev_gyro_A" class="" style="">'
                 +   '<div><label class="name" style="vertical-align:middle;display: inline-block;margin-left: 5%;" for="hidden-input">'
                 +     'gyro A</label></div>'
                 +   '<div class="progress battery-bar" style="">'
                 +     '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%;">'
                 +     '</div>'
                 +   '</div>'
                 +   '<div class="module-closer"><span style="vertical-align:middle;display: inline-block;margin-left: 25%"></span></div>'
                 +   '<div class="name-changer" style="margin-left: 5%;"><input type="text" size="7"></div>'
                 +   '<div class="v-display" style="white-space: pre-wrap;vertical-align:middle;margin-left: 5%;margin-top:10%"></div>'
                 + '</div>',
        class    : 'v_gyro',
        name     : name,
        type     : 'Gyro'
      },
      _condition_map = {
        _is_shaking      : false,
        _is_shaking_hard : false
      },
    // conditions
    //
      _is_shaking, _is_not_shaking;

    _device = V_Device(_input_map);
    _dom_map = {
      $dom       : _device.getDom(),
      $display   : _device.getDom().find('.v-display')
    };

    _device.updateEList(_condition_map);

    // Register Device events with DOMs
    //
    // v_gyro is shaking
    _dom_map.$dom.on('mousedown', function () {
      _device.consume_still(_state_map, 0.75);
      if(_state_map.battery <=1) _dom_map.$dom.attr('disabled', 'disabled');
      drawMouseSpeedDemo();
    });

    _dom_map.$dom.on('mouseup', function () {
      //_device.makeEvent(_id, '_is_shaking_hard', false, 0);
      _device.makeEvent('_is_shaking', false, 0);
      clearTimeout(temp_time);
      _device.consume_clear();
    });
    // End DOM events register

    // v_gyro Helper methods
    var temp_time;
    function drawMouseSpeedDemo() {
      var
        mrefreshinterval = 310, // update display every 500ms
        lastmousex=-1, lastmousey=-1, lastmousetime,
        mousetravel= 0, mousetravelx = 0, mousetravely=0,
        _status = 'stop', _old_status='stop',
        last_pps = 0;
      _dom_map.$dom.on('mousemove', function(e) {
        var
          mousex = e.pageX,
          mousey = e.pageY;
        if (lastmousex > -1) {
          mousetravel += Math.max( Math.abs(mousex-lastmousex), Math.abs(mousey-lastmousey) );
          mousetravelx += mousex-lastmousex;
          mousetravely += mousey-lastmousey;
        }
        lastmousex = mousex;
        lastmousey = mousey;
      });
      var mdraw = function() {
        clearTimeout(temp_time);
        var md = new Date();
        var timenow = md.getTime();

        if (lastmousetime && lastmousetime!=timenow) {
          var
            ppsx = Math.round(mousetravelx / (timenow - lastmousetime) * 1000),
            ppsy = Math.round(mousetravely / (timenow - lastmousetime) * 1000),
            pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
          mousetravelx = 0;
          mousetravely = 0;
          mousetravel  = 0;

          if (pps !== last_pps) {
            if (pps > _state_map.threshold_hard) {
              _status = 'hard shaking';
            }
            //if ( pps > _state_map.threshold && pps  < _state_map.threshold_hard) {
            if ( pps > _state_map.threshold) {
              _status = 'shaking';
            }
            if ( pps < _state_map.threshold/2 ) {
              _status = 'stop';
            }
          }

          // Need to make event to change multiple events at the same time
          //
          if (_status !== _old_status ) {
            if (_status === 'shaking' ) {
              _device.makeEvent('_is_shaking', true, 10);
            }
            if ( _status === 'hard shaking') {
              //_device.makeEvent(_id, '_is_shaking_hard', true, 0);
            }
            if ( _status === 'stop' ) {
              //_device.makeEvent(_id, '_is_shaking_hard', false, 0);
              _device.makeEvent('_is_shaking', false, 0);
            }
            _dom_map.$display.text('速度: ' + pps);
          }
          //console.log(_status, _old_status);
          //_is_shaking(pps);
        }
        last_pps = pps;
        _old_status = _status;
        lastmousetime = timenow;
        temp_time = setTimeout(mdraw, mrefreshinterval);
      };
      // We could use setInterval instead, but I prefer to do it this way
      temp_time = setTimeout(mdraw, mrefreshinterval);
    }
    // End v_gyro Helper methods

    // Expose Public Functions:
    //
    // End

    return _device;
  };

return {
  devices  : devices,
  router   : router,

  V_Router : V_Router,
  V_Logic  : V_Logic,
  V_Button : V_Button,
  V_Light  : V_Light,
  V_Music  : V_Music,
  V_Gyro   : V_Gyro
};

})();

