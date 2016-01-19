
var app = require( './app' );
var gameServer = app.listen( 3000 );
var socketIO = require( 'socket.io' )( gameServer );


socketIO.on( 'connection', function( socket ){
    console.log( 'user connected');
});


