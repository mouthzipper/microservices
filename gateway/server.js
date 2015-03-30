var Hapi = require( 'hapi' );
var env = process.env[ 'NODE_ENV'] || 'dev';
var Rabbit = require( 'wascally' );
var Rabbus = require( 'rabbus' );
var util = require( 'util' );
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


Rabbit.configure( { connection:config.rabbit } )
	.then( function ( ) {
		server.route( {
			path : '/chix',
			method: 'GET',
			handler : function ( req, res ) {
				var sender = new SomeSender(Rabbit);
				var message = {
					place: "world"
				};
				setInterval( function () {
					sender.send(message, function(){
						console.log( 'test' );
					// res( res );
					});
				}, 1000 );

				res( 'hi ditz' );

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

