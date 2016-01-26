
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
            $scope.roomId = null;

            socketio.emit( 'create-room', null, function( roomId ){
                $scope.url = location.host + '/room/' + roomId;
                $scope.roomId = roomId;
            });

            socketio.on( 'join-user', function( data ){
                data.isReady = false;
                $scope.users.push( data );
            });

            socketio.on( 'leave-user', function( data ){
                console.log( arguments );
            });

            socketio.on( 'ready-user', function( data ){
                angular.forEach( $scope.users, function( item ){
                    if( item.userName === data.userName ){
                        item.isReady = true;
                        return false;
                    }
                });

                var isReadyList = _.filter($scope.users, function( item){
                    return item.isReady === true;
                });

                if( isReadyList.length === $scope.users.length ){
                    socketio.emit( 'ready-all', { roomId:$scope.roomId } );
                }
            });
        }]);
}( window.GlobalService );
