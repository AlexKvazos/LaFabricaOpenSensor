var j5 = require('johnny-five');
var io = require('socket.io-client');
board = new j5.Board();
var previousValue = 0;

const socket = io('http://' + process.env.API_HOST);

/**
 * Send a request to the server to mark La Fábrica as Open
 */
function setOpen() {
  console.log('La fábrica is open');
  socket.emit('update', true);
}

/**
 * Send a request to the server to mark La Fábrica as Closed
 */
function setClosed() {
console.log('La fábrica is closed');
socket.emit('update', false);
}

/**
 * Hardware Sensor
 */
board.on('ready', () => {

  // Create a new `photoresistor` hardware instance.
  var photoresistor = new j5.Sensor({
    pin: "A0",
    freq: 250
  });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function() {
    if (this.value - previousValue <= -100) {
      setOpen();
    } else if (this.value - previousValue >= 100) {
      setClosed();
    }
    previousValue = this.value;
  });

});
