var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost' });

var count = 0;
var max = 100;

// Wait for connection to become established.
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  var exchange = connection.exchange('my-exchange');

  connection.queue('my-queue', function(q){
      // Catch all messages
      q.bind(exchange,"*");
      function ack(){
        if (count < max){
          q.shift();
          setTimeout(ack, 1000);
        }
      }

      // Receive messages
      q.subscribe({ack: true, prefetchCount: 1},  function (message, header, deliveryInfo) {
        // Print messages to stdout
        console.log("+++++++ Cola 1");
        console.log(count++);
        console.log(header);
        console.log(deliveryInfo);
        console.log(message);
        console.log('--------------------------------');
        //ack();
      });

      q.subscribe({ack: true, prefetchCount: 1},  function (message, header, deliveryInfo) {
        // Print messages to stdout
        console.log("******* Cola 2");
        console.log(count++);
        console.log(header);
        console.log(deliveryInfo);
        console.log(message);
        console.log('--------------------------------');
        //ack();
      });
      for(var i = 0; i < max; i++)
        exchange.publish('msg',{hello: 'world'});

      ack();
  });
});