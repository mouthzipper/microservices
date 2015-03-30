var Hapi   = require( 'hapi' );
var env    = process.env[ 'NODE_ENV'] || 'dev';
var Rabbit = require( 'wascally' );
var Rabbus = require( 'rabbus' );
var util   = require( 'util' );
var config = require( './config/config.json')[env];

// start a server
var server = new Hapi.Server();

server.connection( config.api );
// sender
function SomeSender( rabbus ){
	Rabbus.Sender.call(this, rabbus, {
		exchange: 'send-rec.exchange',
		routingKey: 'send-rec.key',
		messageType: 'send-rec.messageType'
	});
}

util.inherits(SomeSender, Rabbus.Sender);
// publisher
function SomePublisher(rabbus){
	Rabbus.Publisher.call(this, rabbus, {
		exchange: 'pub-sub.exchange',
		routingKey: 'pub-sub.key',
		messageType: 'pub-sub.messageType'
	});
}

util.inherits(SomePublisher, Rabbus.Publisher);
// requester
function SomeRequester(rabbus){
	Rabbus.Requester.call(this, rabbus, {
		exchange: 'req-res1.exchange',
		routingKey: 'req-res1.key',
		messageType: 'req-res1.messageType'
	});
}

util.inherits(SomeRequester, Rabbus.Requester);

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
			path : '/publish',
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
		server.route( {
			path : '/request',
			method: 'GET',
			handler : function ( req, res ) {
				var requester = new SomeRequester(Rabbit);
				var msg = {};
				requester.request(msg, function(response, done){
					console.log("Hello", response.place);
					done();
				});

				res( 'this is a message requester' );

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

