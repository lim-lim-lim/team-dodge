
var app = require( './app' );
var gameServer = app.listen( 3000 );
var socketIO = require( 'socket.io' )( gameServer );
var key = -1;

socketIO.on( 'connection', function( socket ){
    console.log( 'user connected');

    socket.on( 'create-room', function(){
        var id = ++key
        socket.isCaptine = true;
        socket.join( id );
        socket.emit( 'create-complete-room', id )
    });
});

