
+function( GlobalService ){'use strict';
    angular.module( 'Joypad', [ 'ngRoute'] )

        .config( [ '$routeProvider', function( $routeProvider ){
            $routeProvider
                .when( '/', { templateUrl:'../views/joypad/user-info.html', controller:'UserInfo'})
                .when( '/ready', { templateUrl:'../views/joypad/ready.html', controller:'Ready'})
                .when( '/game-controller', { templateUrl:'../views/joypad/game-controller.html', controller:'GameController'})
        }] )

        .factory( 'socketio', GlobalService.socketio )

        .controller( 'JoypadBase', [ '$scope', 'socketio', function($scope, socketio ){
            $scope.io = socketio;
            $scope.connectionId;
            $scope.userName;
            $scope.isOwnerUser;
            $scope.setConnectionId = function( value ) { $scope.connectionId = value; };
            $scope.setUserName = function( value ){ $scope.userName = value; };
            $scope.setIsOwnerUser = function( value ){ $scope.isOwnerUser = value; };
        }])

        .controller( 'UserInfo', [ '$scope', '$location', function( $scope, $location ){
            var connectionId = window.location.pathname.split( '/' ).pop();
            $scope.setConnectionId( connectionId );
            $scope.join = function(){
                if( $scope.name.length === 0  ){ alert( 'You must be input your name'); return; }
                if( $scope.joined ){ alert( 'Was join already your name'); return; }
                $scope.io.emit( 'join', { connectionId:connectionId, userName:$scope.name }, function( data ){
                    if( data.result === 'success' ){
                        $scope.joined = true;
                        $scope.setUserName( $scope.name );
                        $scope.setIsOwnerUser( data.isOwnerUser );
                        $location.path( "/ready" );
                    }else{
                        alert( data.msg + ' [ code : '+data.code+']' );
                    }
                });
            }
        }])

        .controller( 'Ready', [ '$scope', '$location', function( $scope, $location ){
            $scope.isReady = false;
            $scope.readyAll = false;
            $scope.ready = function(){ $scope.io.emit( 'ready', null, function(){ $scope.isReady = true; }); };
            $scope.readyCancel = function(){ $scope.io.emit( 'ready-cancel', null, function(){ $scope.isReady = false; }); };
            $scope.startup = function(){ $scope.io.emit( 'startup' ); };
            $scope.io.on( 'ready-all', function(){ $scope.readyAll = true; });
            $scope.io.on( 'ready-all-cancel', function(){ $scope.readyAll = false; });
            $scope.io.on( 'startup', function(){
                console.log( 'startup gamecontroller')
                $location.path( "/game-controller" );
            });
        }] )

        .controller( 'GameController', [ '$scope', function( $scope ){

        }] );

}( window.GlobalService );

























