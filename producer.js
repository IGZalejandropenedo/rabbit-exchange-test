var rabbit = require('./rabbit_manager.js');

var queue = new rabbit({
           "type"      : "amqp"
        ,   "host"      : "localhost"
        ,   "port"      : "5672"
        ,   "user"      : "uDkINI_HsgyzIJ4h"
        ,   "password"  : "2DSMgnPLr-gNTI6qkSNRkso1pq8UZpRT"
        ,   "exchange"  : "uDkINI_HsgyzIJ4h"
        ,   "exchange_opts"   : {"passive" : true}
        ,   "routing_key"   : "*"
        ,   "queue"     : "qlog_q"
        ,   "queue_opts"   : {"passive" : true}
        });

var count = 0;
setInterval(notify, 1000);
function notify(){
	queue.notify({count:count++});
}