
+function( GlobalService ){'use strict';
    angular.module( 'Screen', [ 'ngRoute'] )
        .config( [ '$routeProvider' ,function( $routeProvider ){
            $routeProvider
                .when( '/home', { templateUrl:'./views/screen/home.html'})
                .when( '/connection', { templateUrl : 'views/screen/connection.html',  controller : 'Connection' })
                .when( '/game-world', { templateUrl : 'views/screen/game-world.html' })
                .otherwise( { 'redirectTo' : '/home' });
        }])

        .factory( 'socketio', GlobalService.socketio )

        .controller( 'ScreenBase', [ '$scope', 'socketio', function( $scope, socketio ){
            $scope.io = socketio;
            $scope.usersInfo = [];
            $scope.setUserInfo = function( data ){ $scope.usersInfo = data; }
        }])

        .controller( 'Connection', [ '$scope', '$location', function( $scope, $location ){
            $scope.users = [];
            $scope.connectionId = null;

            $scope.io.emit( 'create-connection-id', null, function( connectionId ){
                $scope.url = location.host + '/connection/' + connectionId;
                $scope.connectionId = connectionId;
            });
            $scope.io.on( 'join-user', function( data ){
                data.isReady = false;
                $scope.users.push( data );
            });
            $scope.io.on( 'leave-user', function( data ){
                console.log( arguments );
            });
            $scope.io.on( 'ready-user', function( data ){
                angular.forEach( $scope.users, function( item ){
                    if( item.userName === data.userName ){ item.isReady = true; return false;}
                });
                var isReadyList = _.filter($scope.users, function( item){ return item.isReady === true; });
                if( isReadyList.length === $scope.users.length ){ $scope.io.emit( 'ready-all' ); }
            });
            $scope.io.on( 'ready-cancel-user', function( data ){
                angular.forEach( $scope.users, function( item ){
                    if( item.userName === data.userName ){ item.isReady = false; return false;}
                });
            });
            $scope.io.on( 'startup', function( usersInfo ){
                $scope.setUserInfo( usersInfo );
                $location.path( '/game-world' );
            });
        }])

        .controller( 'GameWorld', [ '$scope', function( $scope ){
            console.log( $scope.usersInfo );
        }])

        .directive( 'gameWorld', function(){
            return{
                restrict:'E',
                transclude: true,
                controller: 'GameWorld',
                scope:true,
                template:'<div class="wrapper" ng-transclude></div>',
                link:function( $scope, $element, attrs, controller ){

                }
            }
        });
}( window.GlobalService );
