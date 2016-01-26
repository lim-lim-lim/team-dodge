
+function( GlobalService ){'use strict';
    angular.module( 'Joypad', [ 'ngRoute'] )

        .config( [ '$routeProvider', function( $routeProvider ){
            $routeProvider
                .when( '/', { templateUrl:'../views/joypad/user-info.html', controller:'UserInfo'})
                .when( '/ready', { templateUrl:'../views/joypad/ready.html', controller:'Ready'})
        }] )

        .factory( 'socketio', GlobalService.socketio )

        .controller( 'JoypadBase', [ '$scope', 'socketio', function($scope, socketio ){
            $scope.io = socketio;
            $scope.roomId;
            $scope.userName;
            $scope.isCaptine;
            $scope.setRoomId = function( value ) { $scope.roomId = value; };
            $scope.setUserName = function( value ){ $scope.userName = value; };
            $scope.setIsCaptine = function( value ){ $scope.isCaptine = value; };
        }])

        .controller( 'UserInfo', [ '$scope', '$location', function( $scope, $location ){
            var roomId = window.location.pathname.split( '/' ).pop();
            $scope.roomId = roomId;

            $scope.join = function(){
                if( $scope.name.length === 0  ){
                    alert( 'You must be input your name');
                    return;
                }
                if( $scope.joined ){
                    alert( 'Was join already your name');
                    return;
                }
                $scope.io.emit( 'join', { roomId:roomId, userName:$scope.name }, function( data ){
                    if( data.result === 'success' ){
                        $scope.joined = true;
                        $scope.setUserName( $scope.name );
                        $scope.setIsCaptine( data.isCaptine );
                        $location.path( "/ready" );
                    }else{
                        alert( data.msg + ' [ code : '+data.code+']' );
                    }
                });
            }

        }])

        .controller( 'Ready', [ '$scope', function( $scope  ){
            $scope.isReady = false;
            $scope.readyAll = false;
            $scope.ready = function(){
                $scope.io.emit( 'ready', null, function(){
                    $scope.isReady = true;
                });
            };

            $scope.readyCancel = function(){
                $scope.io.emit( 'ready-cancel', function(){
                    $scope.isReady = true;
                });
            };

            $scope.io.on( 'ready-all', function(){
                $scope.readyAll = true;
                console.log($scope.readyAll)
            })
        }] )

        .controller( 'Select', [ '$scope', function( $scope ){

        }] )

}( window.GlobalService )