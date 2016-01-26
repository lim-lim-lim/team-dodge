
+function( GlobalService ){ 'use strict';
    socketio.$inject = [ '$rootScope' ];
    function socketio ( $rootScope ){
        var socketio = io();
        return {
            on:function( eventName, callback ){
                socketio.on( eventName, function(){
                    var args = arguments;
                    $rootScope.$apply( function(){
                        callback.apply( socketio, args );
                    });
                });
            },
            emit:function( eventName, data, callback ){
                socketio.emit( eventName, data, function(){
                    var args = arguments;
                    $rootScope.$apply( function(){
                        callback.apply( socketio, args );
                    });
                } );
            }
        }
    }

    GlobalService.socketio = socketio;

}( window.GlobalService || ( window.GlobalService = {} ) )
