var APP_Script = {
  "APPS_ID": "APPS01",
  "LINES": [
    {
      "LINE_ID": "01",
      "operators": [
        {
          "id" : "cond_001",
          "operator": "start"
        },
        {
          "id" : "cond_002",
          "operator": "or"
        }
      ],
      "conditions": [
        {
          "DEVICE_ID": "X_53945",
          "id"  : "cond_001",
          "title": "CHECK_PIN",
          "topic": "",
          "tags": "ctns",
          "condition" : ">=",
          "value": 1,
          "timer": "TMR1"
        },
        {
          "DEVICE_ID": "X_13579411",
          "id"  : "cond_002",
          "title": "CHECK_MOISTURE",
          "topic": "",
          "tags": "ctns",
          "condition" : ">=",
          "value": 65,
          "timer": "TMR1"
        }
      ],
      "actions": [
        {
          "DEVICE_ID": "X_8589390",
          "id"   : "act_001",
          "title": "ON_RGB",
          "color": "red",
          "duration": 500,
          "topic": ""
        }
      ],
      "else_actions": [
        {
          "DEVICE_ID": "X_8589390",
          "id"   : "act_002",
          "title": "ON_RGB",
          "color": "green",
          "duration": 500,
          "topic": ""
        }
      ]
    },
    {
      "LINE_ID": "02",
      "operators": [
        {
          "id" : "cond_003",
          "operator": "start"
        }
      ],
      "conditions": [
        {
          "DEVICE_ID": "X_13579411",
          "id"  : "cond_003",
          "title": "CHECK_TEMPERATURE",
          "topic": "",
          "tags": "ctns",
          "condition" : ">=",
          "value": 31,
          "timer": "TMR1"
        }
      ],
      "actions": [
        {
          "DEVICE_ID": "X_8590505",
          "id"   : "act_003",
          "title": "ON_FAN",
          "duration": 2000,
          "topic": ""
        }
      ],
      "else_actions": [
        {
          "DEVICE_ID": "X_8590505",
          "id"   : "act_004",
          "title": "OFF_FAN",
          "duration": 2000,
          "topic": ""
        }
      ]
    },
    {
      "LINE_ID": "03",
      "operators": [
        {
          "id" : "cond_004",
          "operator": "start"
        }
      ],
      "conditions": [
        {
          "DEVICE_ID": "X_13579074",
          "id"  : "cond_004",
          "title": "BUTTON_PRESSED",
          "topic": "",
          "tags": "inst",
          "duration": 200
        }
      ],
      "actions": [
        {
          "DEVICE_ID": "X_8589390",
          "id"   : "act_005",
          "title": "OFF_RGB",
          "duration": 2000,
          "topic": ""
        },
        {
          "DEVICE_ID": "X_8590505",
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

