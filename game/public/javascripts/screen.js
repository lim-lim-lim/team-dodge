
+function( GlobalService ){'use strict';
    angular.module( 'Screen', [ 'ngRoute'] )
        .config( [ '$routeProvider' ,function( $routeProvider ){
            $routeProvider
                .when( '/home', { templateUrl:'./views/screen/home.html'})
                .when( '/connection', { templateUrl : 'views/screen/connection.html',  controller : 'Connection' })
                .when( '/game-world', { templateUrl : 'views/screen/game-world.html',  controller : 'GameWorld' })
                .otherwise( { 'redirectTo' : '/home' });
        }])

        .factory( 'socketio', GlobalService.socketio )

        .controller( 'Connection', [ '$scope', '$location', 'socketio', function( $scope, $location, socketio ){
            $scope.users = [];
            $scope.connectionId = null;
            socketio.emit( 'create-connection-id', null, function( connectionId ){
                $scope.url = location.host + '/connection/' + connectionId;
                $scope.connectionId = connectionId;
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
                    if( item.userName === data.userName ){ item.isReady = true; return false;}
                });
                var isReadyList = _.filter($scope.users, function( item){ return item.isReady === true; });
                if( isReadyList.length === $scope.users.length ){ socketio.emit( 'ready-all' ); }
            });
            socketio.on( 'ready-cancel-user', function( data ){
                angular.forEach( $scope.users, function( item ){
                    if( item.userName === data.userName ){ item.isReady = false; return false;}
                });
            });
            socketio.on( 'startup', function(){
                console.log( 'startup screen');
                $location.path( '/game-world' );
            });
        }])

        .controller( 'GameWorld', [ '$scope', function( $scope ){

        }]);
}( window.GlobalService );
