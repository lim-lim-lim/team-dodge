
var app = require( './app' );
var gameServer = app.listen( 3000 );
var socketIO = require( 'socket.io' )( gameServer );
var roomCount = -1;
var socketMap = {};
var keyPrefix = 'go-';

socketIO.on( 'connection', function( socket ){
    socket.on( 'create-room', function( data, callback ){
        var roomId = keyPrefix + (++roomCount);
        socket.id = roomId;
        socket.join( roomId );
        socketMap[ roomId ] = { screen:socket, captine:null, users:[]};
        callback( roomId );
    });

    socket.on( 'join', function( data, callback ){
        var roomId = data.roomId;
        var socketGroup = socketMap[ roomId ];
        var screen = socketGroup.screen;
        if( screen ){
            var userName = data.userName;
            var joinedUsers = socketGroup.users;
            socket.id = userName;
            socket.roomId = roomId;
            socket.screen = screen;
            socket.captine = socketGroup.captine;
            for( var i= 0, count=joinedUsers.length ; i<count ; i+=1 ){
                if( userName === joinedUsers[i].userName ){
                    callback( { result:'error', code:'01', msg:'duplicated ID'});
                    return;
                }
            }
            socket.name = userName;
            socket.join( roomId );
            var isCaptine = false;
            if( socketGroup.users.length === 0 ){
                socketGroup.captine = socket;
                isCaptine = true;
            }
            socketGroup.users.push( socket );
            screen.emit( 'join-user', { userName:userName, isCaptine:isCaptine } );
            callback( { result:'success', isCaptine:isCaptine } );

        }else{

            callback( { result:'error', code:'00', msg:'room not found'});
        }
    })

    socket.on( 'ready', function( data, callback ){
        socket.screen.emit( 'ready-user', { userName:socket.id } );
        callback();
    });

    socket.on( 'ready-all', function( data ){
        socketMap[ data.roomId ].captine.emit( 'ready-all' );
    });
});


socketIO.on( 'disconnect', function( socket ){

});
