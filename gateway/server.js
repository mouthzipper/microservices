var Hapi   = require( 'hapi' );
var env    = process.env[ 'NODE_ENV'] || 'dev';
var Rabbit = require( 'wascally' );
var Rabbus = require( 'rabbus' );
var util   = require( 'util' );
var config = require( './config/config.json')[env];

// start a server
var server = new Hapi.Server();

server.connection( config.api );

function SomeSender( rabbus ){
	Rabbus.Sender.call(this, rabbus, {
		exchange: 'send-rec.exchange',
		routingKey: 'send-rec.key',
		messageType: 'send-rec.messageType'
	});
}

util.inherits(SomeSender, Rabbus.Sender);

function SomePublisher(rabbus){
	Rabbus.Publisher.call(this, rabbus, {
		exchange: 'pub-sub.exchange',
		routingKey: 'pub-sub.key',
		messageType: 'pub-sub.messageType'
	});
}

util.inherits(SomePublisher, Rabbus.Publisher);


Rabbit.configure( { connection:config.rabbit } )
	.then( function ( ) {
		server.route( {
			path : '/send',
			method: 'GET',
			handler : function ( req, res ) {
				var sender = new SomeSender(Rabbit);
				var message = {
					place: "world"
				};
				setInterval( function () {
					sender.send(message, function(){
						console.log( 'sending message' );
					});
				}, 5000 );

				res( 'this is a message sender' );

			}
		});
		server.route( {
			path : '/pub',
			method: 'GET',
			handler : function ( req, res ) {
				var publish = new SomePublisher(Rabbit);
				var message = {
					place: "world"
				};
				setInterval( function () {
					publish.publish(message, function(){
						console.log( 'publishing message' );
					});
				}, 1000 );

				res( 'this is a message publisher' );

			}
		});
		server.start( function () {
			console.log( 'server running at', server.info.uri );
		});
	} )
	.catch( function(err) {
		setImmediate( function () {
			throw errr;
		});
	});

