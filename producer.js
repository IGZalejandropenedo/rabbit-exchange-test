var rabbit = require('./rabbit_manager.js');

var queue = new rabbit({
            "host"      : "localhost"
        ,   "port"      : ""
        ,   "exchange"  : "sokobank_feed"
        ,   "queue"     : "sokobank_feed_q"
        ,   "type"      : "rabbitmq"
        });

var count = 0;
setInterval(notify, 1000);
function notify(){
	queue.notify({count:count++});
}