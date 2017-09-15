var j5 = require('johnny-five');
var agent = require('agent');
board = new j5.Board({ repl: false });
var previousValue = 0;

const { SLACK_WEBHOOK } = process.env;

/**
 * Send a request to the server to mark La Fábrica as Open
 */
function setOpen() {
  console.log('La fabrica is open');
  agent.post(SLACK_WEBHOOK).send({
    attachments: [
      {
        color: '#7ed510',
        title: 'La Fábrica is now open!',
        ts: Date.now()/1000
      }
    ]
  })
  .end((err, res) => {
    if (err) return logger.error(err);
  });
}

/**
 * Send a request to the server to mark La Fábrica as Closed
 */
function setClosed() {
  console.log('La fabrica is closed');
  agent.post(SLACK_WEBHOOK).send({
      attachments: [
        {
          color: '#F23E0F',
          title: 'La Fábrica is now closed!',
          ts: Date.now()/1000
        }
      ]
    })
    .end((err, res) => {
      if (err) return logger.error(err);
    });
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
