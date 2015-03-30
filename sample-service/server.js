var env = process.env[ 'NODE_ENV'] || 'dev';
var util = require( 'util' );
var Rabbit = require( 'wascally' );
var Rabbus = require( 'rabbus' );
var config = require( './config/config.json')[env];

function SomeReceiver(rabbus){
	Rabbus.Receiver.call(this, rabbus, {
		exchange: "send-rec.exchange",
		queue: "send-rec.queue",
		routingKey: "send-rec.key",
		messageType: "send-rec.messageType"
	});
}

util.inherits(SomeReceiver, Rabbus.Receiver);

Rabbit.configure( { connection:config.rabbit } )
	.then( function ( ) {
		var receiver = new SomeReceiver(Rabbit);

		receiver.receive(function(message, done){
			console.log("hello", message.place);
			done();
		});
	} )
	.catch( function(err) {
		setImmediate( function () {
			throw errr;
		});
	});

