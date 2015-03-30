var env    = process.env[ 'NODE_ENV'] || 'dev';
var util   = require( 'util' );
var Rabbit = require( 'wascally' );
var Rabbus = require( 'rabbus' );
var config = require( './config/config.json')[env];

function SomeResponder(rabbus){
	Rabbus.Responder.call(this, rabbus, {
		exchange: 'req-res1.exchange',
		queue: 'req-res1.queue',
		routingKey: 'req-res1.key',
		limit: 1,
		messageType: 'req-res1.messageType'
	});
}

util.inherits(SomeResponder, Rabbus.Responder );

Rabbit.configure( { connection:config.rabbit } )
	.then( function ( ) {
		var x = 0;
		var responder = new SomeResponder(Rabbit);
		responder.handle(function(message, respond){
			x++;
			console.log( 'responding', x );
			respond( { place : 'world' } );
		});
	} )
	.catch( function(err) {
		setImmediate( function () {
			throw errr;
		});
	});

