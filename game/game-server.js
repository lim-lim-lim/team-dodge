
var app = require( './app' );
var gameServer = app.listen( 3000 );
var socketIO = require( 'socket.io' )( gameServer );
var keyCount = -1;
var keyPrefix = 'key-';
var socketMap = {};


socketIO.on( 'connection', function( socket ){
    socket.on( 'create-connection-id', function( data, callback ){
        var connectionId = keyPrefix + (++keyCount);
        socket.connectionId = connectionId;
        socketMap[ connectionId ] = { screen:socket, ownerUser:null, users:[]};
        callback( connectionId );
    });

    socket.on( 'join', function( data, callback ){
        var connectionId = data.connectionId;
        var socketGroup = socketMap[ connectionId ];
        if( socketGroup ){
            var screen = socketGroup.screen;
            var userName = data.userName;
            var joinedUsers = socketGroup.users;
            socket.userName = userName;
            socket.connectionId = connectionId;
            socket.screen = screen;
            for( var i= 0, count=joinedUsers.length ; i<count ; i+=1 ){
                if( userName === joinedUsers[i].userName ){
                    callback( { result:'error', code:'01', msg:'duplicated ID'});
                    return;
                }
            }
            socket.name = userName;
            socket.join( connectionId );
            var isOwnerUser = false;
            if( socketGroup.users.length === 0 ){
                socketGroup.ownerUser = socket;
                isOwnerUser = true;
            }
            socketGroup.users.push( socket );
            screen.emit( 'join-user', { userName:userName, isOwnerUser:isOwnerUser } );
            socketMap[ socket.connectionId].ownerUser.emit( 'ready-all-cancel' );
            callback( { result:'success', isOwnerUser:isOwnerUser } );
        }else{
            callback( { result:'error', code:'00', msg:'room not found'});
        }
    })

    socket.on( 'ready', function( data, callback ){
        socket.screen.emit( 'ready-user', { userName:socket.userName } );
        callback();
    });

    socket.on( 'ready-cancel', function( data, callback ){
        socket.screen.emit( 'ready-cancel-user', { userName:socket.userName } );
        socketMap[ socket.connectionId].ownerUser.emit( 'ready-all-cancel' );
        callback();
    });

    socket.on( 'ready-all', function(){
        socketMap[ socket.connectionId ].ownerUser.emit( 'ready-all' );
    });

    socket.on( 'startup', function(){
        socketIO.to( socket.connectionId ).emit( 'startup' );
        var socketGroup = socketMap[ socket.connectionId ];
        var usersInfo =  socketGroup.users.map( function( item ){
            return { id:item.id, userName:item.userName, position:{ x:0, y:0 }, vector:{ radian:0, length:0 } };
        });
        socketGroup.screen.emit( 'startup', usersInfo  );
    });

    socket.on( 'updateVector', function( data ){
        data.id = socket.id;
        socketMap[ socket.connectionId ].screen.emit( 'updateVector', data  );
    });
});


socketIO.on( 'disconnect', function( socket ){

});
