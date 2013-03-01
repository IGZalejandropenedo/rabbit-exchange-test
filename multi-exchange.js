var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost' });

var count = 0;
var max = 100;

// Wait for connection to become established.
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  connection.exchange('root', {type:'topic'}, function(root){
    connection.exchange('leaf1', {type:'topic'}, function(leaf1){
        //console.log(leaf2);
        leaf1.bind(root,"#");

        connection.exchange('leaf2', {type:'topic'}, function(leaf2){
          connection.queue('queue1', function(q){
            q.bind(leaf2,"q1");

            q.subscribe(function (message, header, deliveryInfo) {
              // Print messages to stdout
              console.log("******* Cola 1");
              console.log(count++);
              //console.log(header);
              console.log(deliveryInfo);
              console.log(message);
              console.log('--------------------------------');
            });
          });
        });

        connection.exchange('leaf3', {type:'topic'}, function(leaf3){
          connection.queue('queue2', function(q){
            q.bind(leaf1,"q2");

            q.subscribe(function (message, header, deliveryInfo) {
              // Print messages to stdout
              console.log("******* Cola 2");
              console.log(count++);
              //console.log(header);
              console.log(deliveryInfo);
              console.log(message);
              console.log('--------------------------------');
            });
          });
        });
      });

      connection.exchange('leaf2', {type:'topic'}, function(leaf2){
        //console.log(leaf2);
        leaf2.bind(root,"#");

        connection.exchange('leaf3', {type:'topic'}, function(leaf3){
          connection.queue('queue3', function(q){
            q.bind(leaf2,"q3");

            q.subscribe(function (message, header, deliveryInfo) {
              // Print messages to stdout
              console.log("******* Cola 3");
              console.log(count++);
              //console.log(header);
              console.log(deliveryInfo);
              console.log(message);
              console.log('--------------------------------');
            });
          });
        });

        connection.exchange('leaf4', {type:'topic'}, function(leaf3){
          connection.queue('queue4', function(q){
            q.bind(leaf2,"q4");

            q.subscribe(function (message, header, deliveryInfo) {
              // Print messages to stdout
              console.log("******* Cola 4");
              console.log(count++);
              //console.log(header);
              console.log(deliveryInfo);
              console.log(message);
              console.log('--------------------------------');
            });
          });
        });

      });

      // Publish information
      function send(){
        var q = 'q' + Math.floor((Math.random()*6)+1);
        console.log("Publish to", q);
        root.publish(q ,{hello: 'world'});
        count++;
        if(count++ <= max)
          setTimeout(send, 1000);
      }
      setTimeout(send, 1000);
  });
});