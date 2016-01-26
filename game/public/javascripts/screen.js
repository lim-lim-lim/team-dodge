
+function( GlobalService ){'use strict';
    angular.module( 'Screen', [ 'ngRoute'] )
        .config( [ '$routeProvider' ,function( $routeProvider ){
            $routeProvider
                .when( '/home', { templateUrl:'./views/screen/home.html'})
                .when( '/wating', { templateUrl : 'views/screen/wating.html',  controller : 'Wating' })
                .otherwise( { 'redirectTo' : '/home' });
        }])
        .factory( 'socketio', GlobalService.socketio )
        .controller( 'Wating', [ '$scope', '$http', 'socketio', function( $scope, $http, socketio ){

            $scope.users = [];

            socketio.emit( 'create-room', null, function( key ){
                $scope.url = location.host + '/room/' + key;
            } );

            socketio.on( 'join-user', function( data ){
                data.isReady = false;
                $scope.users.push( data );
            });

            socketio.on( 'leave-user', function( data ){
                console.log( arguments );
            });

            socketio.on( 'ready-user', function( data ){
                angular.forEach( $scope.users, function( item, index ){
                    if( item.userName === data.userName ){
                        item.isReady = true;
                        return false;
                    }
                } );
            });
        }]);
}( window.GlobalService );
