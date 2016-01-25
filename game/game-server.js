
var app = require( './app' );
var gameServer = app.listen( 3000 );
var socketIO = require( 'socket.io' )( gameServer );
var key = -1;
var socketMap = {};
socketIO.on( 'connection', function( socket ){
    console.log( 'user connected');

    socket.on( 'create-room', function( data, callback ){
        var id = ++key;
        socket.id = key;
        socket.join( id );
        socketMap[ id ] = socket;
        callback( key );
    });
});

