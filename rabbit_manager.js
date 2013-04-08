var amqp = require('amqp'),
q		= require('q'),
extend = require("extend")
;

var rabbit = function(p_config){
	var self = this;

	var defaults = 	{
            "host"      : "localhost"
        ,   "port"      : "5672"
//        ,   "exchange"  : "defExc"
        ,   "exchange_opts"   : {}
        ,	"routing_key" : "*"
        ,   "queue"     : "defQue"
        ,   "queue_opts"   : {"type" : "topic"}
        ,   "type"      : "amqp"
    };

	this.config = extend(defaults,p_config);
	var auth = (self.config.user || "");
	if(auth.length > 0) {
		if(self.config.password) {
			auth += ":"+self.config.password + "@";
		} else {
			auth += "@";
		}
	}

	this.config.url = (self.config.url ? self.config.url : 'amqp://' + auth + self.config.host + (!!self.config.port && self.config.port.length > 0 ? ':' + self.config.port : ''));
	console.log(self.config);

	this.connection = null;
	this.exchange = null;
	this.queue = null;

	function createConnection() {
		console.log('Connecting to', self.config.url);
		var promise = q.defer();
		if(!self.connection){
			self.connection = amqp.createConnection({url : self.config.url});
			self.connection.on('ready', function(){
				console.log("Connection ready");
				promise.resolve();
			});
		} else {
			console.log("Connection existed", self.config.url);
			promise.resolve();
		}
		return promise.promise;
	}

	this.subscribe = function(callback){
		createConnection().then(function(){
			/*if(!self.exchange && self.config.exchange){
				console.log('creating exchange');
				self.exchange = self.connection.exchange(self.config.exchange, self.config.exchange_opts);
			}*/
			if(!this.queue){
				console.log('creating queue', self.config.queue);
				self.connection.queue(self.config.queue, self.config.queue_opts, function(q){
					self.queue = q;
					/*if (self.config.exchange) {
						q.bind(self.config.exchange, self.config.routing_key);
					} else {*/
						q.bind( self.config.routing_key);
					//}
					q.subscribe(callback);
				});
			}
		});
	};

	this.notify = function(data){
		createConnection().then(function(){
			console.log("publish", data);
			if(!self.exchange){
				console.log('creating exchange', self.config.exchange);
				self.exchange = self.connection.exchange(self.config.exchange, self.config.exchange_opts );
			}

			self.exchange.publish(self.config.routing_key, data, {}, console.log);
		});
	};

	this.reset = function(){
		/*if (self.queue){
			self.queue.unbind(self.config.queue);
		}
		if (self.exchange){
			self.exchange.unbind(self.config.exchange);
		}*/
		if (self.connection){
			self.connection.end();
			self.queue = null;
			self.exchange = null;
			self.connection = null;
		}
	};
};

module.exports = rabbit;