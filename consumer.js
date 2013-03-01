var rabbit = require('./rabbit_manager.js');

var queue = new rabbit({
            "host"      : "localhost"
        ,   "port"      : ""
        ,   "exchange"  : "sokobank_feed"
        ,   "queue"     : "sokobank_feed_q"
        ,   "type"      : "rabbitmq"
        });

queue.subscribe(function (message, header, deliveryInfo){
	console.log(header);
    console.log(deliveryInfo);
    console.log(message);
    console.log('--------------------------------');
});
