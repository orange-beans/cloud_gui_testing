var APP_Script = {
  "apps_id": "APPS01",
  "lines": [
    {
      "line_id": "01",
      "logics": [
        {
          "id" : "cond_001",
          "logic": "start"
        },
        {
          "id" : "cond_002",
          "logic": "or"
        }
      ],
      "conditions": [
        {
          "device_id": "X_53945",
          "id"  : "cond_001",
          "title": "CHECK_PIN",
          "topic": "",
          "tags": "ctns",
          "operator" : ">=",
          "value": 1,
          "timer": "TMR1"
        },
        {
          "device_id": "X_13579411",
          "id"  : "cond_002",
          "title": "CHECK_MOISTURE",
          "topic": "",
          "tags": "ctns",
          "operator" : ">=",
          "value": 65,
          "timer": "TMR1"
        }
      ],
      "actions": [
        {
          "device_id": "X_8589390",
          "id"   : "act_001",
          "title": "ON_RGB",
          "color": "red",
          "duration": 500,
          "topic": ""
        }
      ],
      "else_actions": [
        {
          "device_id": "X_8589390",
          "id"   : "act_002",
          "title": "ON_RGB",
          "color": "green",
          "duration": 500,
          "topic": ""
        }
      ]
    },
    {
      "line_id": "02",
      "logics": [
        {
          "id" : "cond_003",
          "logic": "start"
        }
      ],
      "conditions": [
        {
          "device_id": "X_13579411",
          "id"  : "cond_003",
          "title": "CHECK_TEMPERATURE",
          "topic": "",
          "tags": "ctns",
          "operator" : ">=",
          "value": 31,
          "timer": "TMR1"
        }
      ],
      "actions": [
        {
          "device_id": "X_8590505",
          "id"   : "act_003",
          "title": "ON_FAN",
          "duration": 2000,
          "topic": ""
        }
      ],
      "else_actions": [
        {
          "device_id": "X_8590505",
          "id"   : "act_004",
          "title": "OFF_FAN",
          "duration": 2000,
          "topic": ""
        }
      ]
    },
    {
      "line_id": "03",
      "logics": [
        {
          "id" : "cond_004",
          "logic": "start"
        }
      ],
      "conditions": [
        {
          "device_id": "X_13579074",
          "id"  : "cond_004",
          "title": "BUTTON_PRESSED",
          "topic": "",
          "tags": "inst",
          "duration": 200
        }
      ],
      "actions": [
        {
          "device_id": "X_8589390",
          "id"   : "act_005",
          "title": "OFF_RGB",
          "duration": 2000,
          "topic": ""
        },
        {
          "device_id": "X_8590505",
          "id"   : "act_006",
          "title": "OFF_FAN",
          "duration": 2000,
          "topic": ""
        }
      ],
      "else_actions": []
    }
  ]
};

