var j5 = require('johnny-five');
var io = require('socket.io-client');
board = new j5.Board({ repl: false });
var previousValue = 0;

const socket = io(process.env.API_HOST);

/**
 * Send a request to the server to mark La Fábrica as Open
 */
function setOpen() {
  console.log('La fabrica is open');
  socket.emit('update', true);
}

/**
 * Send a request to the server to mark La Fábrica as Closed
 */
function setClosed() {
console.log('La fabrica is closed');
socket.emit('update', false);
}

/**
 * Hardware Sensor
 */
board.on('ready', () => {

  // Create a new `photoresistor` hardware instance.
  var photoresistor = new j5.Sensor({
    pin: "A0",
    freq: 1000
  });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function() {
    console.log(this.value - previousValue);
    if (this.value - previousValue <= -300) {
      setOpen();
    } else if (this.value - previousValue >= 300) {
      setClosed();
    }
    previousValue = this.value;
  });

});
