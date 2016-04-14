/**
 * Created by cczhang on 1/9/2015.
 */
// Common DOM elements prototype
//
prjX.Dom_Module = function (_input_map) {
  var
    _module,
    config_map = {
      main_html: String(),
      class    : '',
      id       : '',
      pre_func : function () {},
      rd_func  : function () {},
      name     : '',
      type     : '',

      settable_map: {
        main_html: true,
        class    : true,
        name     : true,
        id       : true,
        rd_func  : true,
        type     : true
      }
    },

    stateMap = {
      $append_target : null,
      $module_dom  : null,

      temp_html      : null,
      pre_flag       : false
    },

    jqueryMap = {},
    setJqueryMap,
    configModule,

  // Basic Public DOM methods
    init,
    getDomId,  getDom, setLabel, setText,
    detach, attach, remove,
    create, destroy,

  // Basic Public Device methods
    getName, changeName;

  // Configure Module according to different devices.
  configModule = function (input_map) {
    prjX.util.setConfigMap({
      input_map   : input_map,
      settable_map: config_map.settable_map,
      config_map  : config_map
    });
    return true;
  };
  if (_input_map !== undefined) configModule(_input_map);

  // Generate a random module id if _module_id is undefined
  //
  if( config_map.id === '' ) {
    config_map.id = config_map.class + '_' + idGen.random_num(3, 100);
  }

  if (config_map.name === undefined ) config_map.name = config_map.id;

  // Private methods
  setJqueryMap = function () {
    var
      $append_target = stateMap.$append_target,
      $module_dom  = stateMap.$module_dom;
    jqueryMap = {
      $append_target: $append_target,
      // Stage Module
      $module_dom : $module_dom
    };
  };

  // Create a DOM for the stage module, and set it's attributes
  // and it's temp html to show
  //
  stateMap.$module_dom = $(config_map.main_html);
  stateMap.$module_dom.attr({
    class: config_map.class,
    id   : config_map.id
  });

  // Public DOM methods
  // Public Method /detach/
  // Detach DOM from the container, only if the container exists
  detach = function () {
    if (stateMap.$append_target) {
      stateMap.$module_dom.detach();
    }
    else {
      return false;
    }
  };

  remove = function () {
    if (stateMap.$append_target) {
      stateMap.$module_dom.remove();
    }
    else {
      return false;
    }
  };
  // /detach/

  // Public Method /attach/
  // Attach DOM to the container
  attach = function () {
    // With _$con parameter or without
    //if (_$con == stateMap.$append_target ) {
    //  _$con.append(stateMap.$module_dom);
    //}
    if ( stateMap.$append_target ) {
      stateMap.$append_target.append(stateMap.$module_dom);
    }
    else {
      return false;
    }
  };
  // /attach/

// End public method /configModule/

// Begin public method /initModule/
// Purpose   : Initializes module
//
  init = function ($append_target) {

    stateMap.$append_target = $append_target;

    setJqueryMap();
  };

  getDomId = function () {
    return config_map.id;
  };

  // Return the module's DOM back
  getDom = function () {
    return stateMap.$module_dom;
  };

  // Set the label of the module's DOM
  setLabel = function (label_str) {
    this.getDom().find('label').text(label_str);
  };

  setText = function ($item, label_str) {
    if ( $item == null ) {
      $item = 'label';
    }
    this.getDom().find($item).text(label_str);
  };

  // Get Name and change Name of the device
  // these two can be combined as one function
  //
  getName = function() {
    return config_map.name;
  };

  changeName = function(_name, $dom_name) {
    var _dom_name = $dom_name || this.getDom().find('.name');
    config_map.name = _name;
    _dom_name.text(_name);
    return true;
  };

  create = function ($target) {
    _module.init($target);
    _module.attach();
  };

  destroy = function () {
    _module.remove();
    _module = {};
  };

  // Public virtual device DOM methods
  // && common methods
  //
  _module = {
    configModule: configModule,
    init        : init,

    getId       : getDomId,
    getDom      : getDom,
    setLabel    : setLabel,
    setText     : setText,
    detach      : detach,
    attach      : attach,
    remove      : remove,

    getName     : getName,
    changeName  : changeName,

    create      : create,
    destroy     : destroy
  };

  return _module;
};

//////////////////////////////////////////////////////////////////////////////////
// Create Command Buttons
// this is a prototype of Dom_module
//
var Cmd_Btn = function (obj) {
  var
    _cmd_btn,
    $tar_dsp = $(),
    $tar_fun = $(),
    _dom_map = {
      $dom    : null,
      $menu   : null
    },
    _input_map = {
      main_html: String()
               + '<div id="" class="btn-group-lg hovertext" role="group" title="text">'
               +   '<button class="btn-lg btn-default dropdown-toggle name" type="button" data-toggle="dropdown">Light C'
               +     '<span class="caret"></span></button>'
               +   '<ul class="dropdown-menu">'
               +   '</ul>'
               + '</div>',
      class    : 'btn-group',
      name     : obj.getName() || 'test',
      id       : 'test_' + obj.getId()
    },
  // Methods
  //
    setTarget;

  _cmd_btn = prjX.Dom_Module(_input_map);
  //_id = _cmd_btn.getId();
  _dom_map = {
    $dom     : _cmd_btn.getDom(),
    $name    : _cmd_btn.getDom().find('.name'),
    $menu    : _cmd_btn.getDom().find('.dropdown-menu')
  };

  _dom_map.$name.text( _cmd_btn.getName() );
  _dom_map.$dom.attr({
    title: obj.getType()
  });

  // The added func to generate buttons
  //
  $.each(obj.f_obj["actions"], function(idx, val_obj) {
    var
      $temp = $('<li class=""><a href="#"></a></li>');
    $temp.find('a').text(val_obj.name);
    $temp.attr({
      class: obj.getId() || 'test_' + val_obj.name
    });

    $temp.on('click', function () {

      var _tmp_lan_o = Lan_obj(
        obj.getName(), obj.getId(),
        ', ' + val_obj.disp_str,
        '\r\n ' + val_obj.func_str
      );

      _tmp_lan_o.getDom().css('background-color', '#f39c12');


      lan.lan_ary.push(_tmp_lan_o);
      //_tmp_lan_o.create($tar_dsp);
      _tmp_lan_o.create($('#sortable'));

      //
      lan.str_ary  = [];
      lan.fuc_ary  = [];
      $.each(lan.lan_ary, function(idx, _obj) {
        lan.str_ary.push(_obj["dsp_str"]);
        lan.fuc_ary.push(_obj["fuc_str"]);
      });

      //if(lan.lang === 'cn') {
      //  lan.str_ary.push(', ' + val_obj.disp_str);
      //  lan.fuc_ary.push('\r\n ' + val_obj.func_str);
      //}
      //
      //if(lan.lang === 'en') {
      //  lan.str_ary.push(', then ' + val_obj.disp_str);
      //  lan.fuc_ary.push('\r\n ' + val_obj.func_str);
      //}

      console.log(lan.str_ary, lan.fuc_ary);
    });
    _dom_map.$menu.append($temp);
  });

  $.each(obj.f_obj["conditions"], function(idx, val_obj) {
    var
      $temp = $('<li class=""><a href="#"></a></li>');
    $temp.find('a').text(val_obj.name);
    $temp.attr({
      class: obj.getId() || 'test_' + val_obj.name
    });

    $temp.on('click', function () {

      var _tmp_lan_o = Lan_obj(
        obj.getName(), obj.getId(),
        val_obj.disp_str,
        ' ' + val_obj.func_str
      );

      if( obj.getId().indexOf('logic') > -1) {

      }
      else {
        _tmp_lan_o.getDom().css('background-color', '##1abc9c');
      }


      lan.lan_ary.push(_tmp_lan_o);
      _tmp_lan_o.create($('#sortable'));


      //
      lan.str_ary  = [];
      lan.fuc_ary  = [];
      $.each(lan.lan_ary, function(idx, _obj) {
        lan.str_ary.push(_obj["dsp_str"]);
        lan.fuc_ary.push(_obj["fuc_str"]);
      });
      //lan.str_ary.push(val_obj.disp_str);
      //lan.fuc_ary.push(' ' + val_obj.func_str);

      console.log(lan.str_ary, lan.fuc_ary);
    });

    _dom_map.$menu.append($temp);

  });

  setTarget = function ($dsp, $fuc) {
    $tar_dsp = $dsp || $();
    $tar_fun = $fuc || $();
  };

  // Note: combine setTarget with Create
  //
  _cmd_btn.setTarget = setTarget;
  return _cmd_btn;
};

//////////////////////////////////////////////////////////////////////////////////
// Create Language objects
// this is a prototype of Dom_module
//
var Lan_obj = function (obj_name, obj_id, dsp_str, fuc_str) {
  var
    _lan_obj, _added_feature,
    _dom_map = {
      $dom    : null
    },
    _input_map = {
      //main_html: String()
      //         + '<span id="" class="" style="float:left;border:solid thin">'
      //         + '</span>',
      main_html: String()
               + '<span class="" style="display:inline;border:solid thin;">'
               + '</span>',
      class    : 'lan-object',
      name     : obj_name || 'test',
      id       : obj_id + '_lan_obj_' + prjX.util.idTools.random_num(3,999)
    };

  _lan_obj = prjX.Dom_Module(_input_map);

  _dom_map = {
    $dom     : _lan_obj.getDom()
  };

  // Set DOM text using dsp_str
  _dom_map.$dom.text(dsp_str);

  // Create a lan_obj
  //
  _added_feature = {
    dsp_str  :  dsp_str,
    fuc_str  :  fuc_str,
    dom      :  _dom_map.$dom,
    uni_id   :  _input_map.id,
    mother_id:  obj_id
  };

  $.extend(_lan_obj, _added_feature);

  return _lan_obj;
};