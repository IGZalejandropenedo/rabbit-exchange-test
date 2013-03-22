var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost' });

var count = 0;
var max = 10000000;
var timeout = 1;

// Wait for connection to become established.
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  connection.exchange('root', {type:'topic'}, function(root){
    //console.log('Root', root.connection.exchanges);
    connection.exchange('leaf1', {type:'topic'}, function(leaf1){
        leaf1.bind(root.name,"1.*");
        leaf1.bind(root.name,"2.*");
        leaf1.bind(root.name,"3.*");
        leaf1.bind(root.name,"4.*");

        connection.exchange('leaf3', {type:'topic'}, function(leaf3){
          leaf3.bind(leaf1.name,"1.*");
          leaf3.bind(leaf1.name,"2.*");
          connection.queue('queue1', function(q){
            q.bind(leaf3.name,"#");


            q.subscribe(function (message, header, deliveryInfo) {
              console.log("******* Cola 1");
              console.log(count++);
              //console.log(header);
              console.log(deliveryInfo);
              console.log(message);
              console.log('--------------------------------');
            });
          });
        });

        connection.exchange('leaf4', {type:'topic'}, function(leaf4){
          leaf4.bind(leaf1.name,"3.*");
          leaf4.bind(leaf1.name,"4.*");
          connection.queue('queue2', function(q){
            q.bind(leaf4.name,"#");

            q.subscribe(function (message, header, deliveryInfo) {
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
        leaf2.bind(root.name,"5.*");
        leaf2.bind(root.name,"6.*");
        leaf2.bind(root.name,"7.*");
        leaf2.bind(root.name,"8.*");

        connection.exchange('leaf5', {type:'topic'}, function(leaf5){
          leaf5.bind(leaf2.name,"5.*");
          leaf5.bind(leaf2.name,"6.*");
          connection.queue('queue3', function(q){
            q.bind(leaf5.name,"#");

            q.subscribe(function (message, header, deliveryInfo) {
              console.log("******* Cola 3");
              console.log(count++);
              console.log(deliveryInfo);
              console.log(message);
              console.log('--------------------------------');
            });
          });
        });

        connection.exchange('leaf6', {type:'topic'}, function(leaf6){
          leaf6.bind(leaf2.name,"7.*");
          leaf6.bind(leaf2.name,"8.*");

          connection.queue('queue4', function(q){
            q.bind(leaf6.name,"#");

            q.subscribe(function (message, header, deliveryInfo) {
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
        var q = Math.floor((Math.random()*8)+1) + '.' + Math.floor((Math.random()*10));
        console.log("Publish RoutingKey", q);
        root.publish(q ,{hello: 'world'});
        //count++;
        if(count <= max)
          setTimeout(send, timeout);
      }
      //send();
      setTimeout(send, 1000);
  });
});