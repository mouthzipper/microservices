var env    = process.env[ 'NODE_ENV'] || 'dev';
var util   = require( 'util' );
var Rabbit = require( 'wascally' );
var Rabbus = require( 'rabbus' );
var config = require( './config/config.json')[env];

function SomeSubscriber(rabbus){
	Rabbus.Subscriber.call(this, rabbus, {
		exchange: "pub-sub.exchange",
			queue: "pub-sub.queue",
			routingKey: "pub-sub.key",
			messageType: "pub-sub.messageType"
		});
}

util.inherits(SomeSubscriber, Rabbus.Subscriber);

Rabbit.configure( { connection:config.rabbit } )
	.then( function ( ) {
		var sub1 = new SomeSubscriber(Rabbit);
		sub1.subscribe(function(message){
			console.log("1: subscriber says hello", message.place);
		});

		var sub2 = new SomeSubscriber(Rabbit);
		sub2.subscribe(function(message){
			console.log("2: subscriber says hello", message.place);
		});

		var sub3 = new SomeSubscriber(Rabbit);
		sub3.subscribe(function(message){
			console.log("3: subscriber says hello", message.place);
		});
	} )
	.catch( function(err) {
		setImmediate( function () {
			throw errr;
		});
	});

