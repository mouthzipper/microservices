var env = process.env[ 'NODE_ENV'] || 'dev';
var Rabbit = require( 'wascally' );
var config = require( './config/config.json')[env];

Rabbit.configure( { connection:config.rabbit } )
	.then( function ( ) {
	} )
	.catch( function(err) {
		setImmediate( function () {
			throw errr;
		});
	});

