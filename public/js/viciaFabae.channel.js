
var cloudMessenger = io.connect('http://192.168.8.174'); // Configured io namespace

//cloudMessenger.on('news', function (data) {
//  console.log(data);
//  cloudMessenger.emit('my other event', {my: 'data'});
//});
var room = 'abc';

cloudMessenger.on('connect', function(){
  console.log("connected");
  cloudMessenger.emit('join-room', room);
  cloudMessenger.emit('room-msg', 'hello roommates');
});

var handleHubFeedback = function (callback) {
  cloudMessenger.on('Hub-Feedback', function (data) {
    callback(data);
  });
};

//cloudMessenger.on('Hub-Feedback', function (data) {
//  console.log(data);
//});

//cloudMessenger.emit('Cloud-Command', {"Command": "Program Beans", "load": APP_Script});

