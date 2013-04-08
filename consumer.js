var rabbit = require('./rabbit_manager.js');

var queue = new rabbit({
        //    "url" : 'amqp://guest:guest@localhost:5672'
           "type"      : "amqp"
        ,   "host"      : "localhost"
        ,   "port"      : "5672"
        ,   "user"      : "guest"
        ,   "password"  : "guest"
        ,   "queue"     : "qlog_q"
        ,   "queue_opts"   : {"passive" : true}
        });

queue.subscribe(function (message, header, deliveryInfo){
	console.log(header);
    console.log(deliveryInfo);
    console.log(message);
    console.log('--------------------------------');
});
