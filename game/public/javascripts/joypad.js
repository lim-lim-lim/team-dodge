
+function( GlobalService ){'use strict';
    angular.module( 'Joypad', [ 'ngRoute'] )

        .config( [ '$routeProvider', function( $routeProvider ){
            $routeProvider
                .when( '/', { templateUrl:'../views/joypad/user-info.html', controller:'UserInfo'})
                .when( '/ready', { templateUrl:'../views/joypad/ready.html', controller:'Ready'})
                .when( '/game-controller', { templateUrl:'../views/joypad/game-controller.html' })
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
            $scope.io.on( 'startup', function(){ $location.path( "/game-controller" ); });
        }] )

        .controller( 'GameController', [ '$scope', function( $scope ){

            $scope.updateDirection = function(){

            };

            $scope.pushButton = function(){

            };

        }])
        .directive( 'gameController', function(){
            return{
                restrict:'E',
                transclude: true,
                controller: 'GameController',
                scope:true,
                template:'<div class="wrapper" ng-transclude></div>',
                link:function( $scope, $element, attrs, controller ){

                    var $document = $( document );
                    var $lever = $element.find( '#lever' );
                    var $leverBg = $element.find( '#lever-bg' );
                    var $leverContainer = $element.find( '#lever-container' );
                    var isLandscape;
                    var vec = {}

                    initEvent();
                    updateDisplay();

                    function initEvent(){
                        window.addEventListener( 'resize', function(){
                            updateDisplay();
                            $scope.$apply();
                        });

                        $lever.on( 'touchstart', function( event ){
                            event.preventDefault();
                            var startTouch = event.originalEvent.touches[0];
                            var startTouchX = isLandscape ? startTouch.pageX : startTouch.pageY;
                            var startTouchY = isLandscape ? startTouch.pageY : startTouch.pageX;
                            var startElementX = isLandscape ? $lever.position().left : $lever.position().top;
                            var startElementY = isLandscape ? $lever.position().top : $lever.position().left;
                            var initPosition = $lever.data( 'init-position' );
                            var initPositionX = isLandscape ? initPosition.x : initPosition.y;
                            var initPositionY = isLandscape ? initPosition.y : initPosition.x;
                            var leverSize = $lever.outerWidth();
                            var leverBgSize = $leverBg.outerWidth();
                            var limitDistance = leverBgSize/2 - ( leverSize/2 );

                            $document.on( 'touchmove', function( event ){
                                event.preventDefault();
                                var moveTouch = event.originalEvent.touches[0];
                                var currentTouchX = isLandscape ? moveTouch.pageX : moveTouch.pageY;
                                var currentTouchY = isLandscape ? moveTouch.pageY : moveTouch.pageX;
                                var x = startElementX+( currentTouchX-startTouchX );
                                var y = startElementY+( ( isLandscape ? currentTouchY : window.innerWidth-currentTouchY )-startTouchY );
                                var xDistance = x-initPositionX;
                                var yDistance = y-initPositionY;
                                var radian = Math.atan2( currentTouchY-startTouchY, currentTouchX-startTouchX );
                                if( Math.sqrt( ( xDistance * xDistance ) + ( yDistance * yDistance ) ) >= limitDistance ){
                                    x = initPositionX + limitDistance * Math.cos( radian );
                                    y = initPositionY + ( isLandscape ? limitDistance : -limitDistance ) * Math.sin( radian );
                                }
                                console.log( radian );
                                $lever.css( { 'left':x, 'top':y });

                            })

                            $document.on( 'touchend', function( event ){
                                event.preventDefault();
                                $document.off( 'touchmove' );
                                $document.off( 'touchend' );
                                $lever.css( { 'left':initPositionX, 'top':initPositionY } );
                            })
                        })


                    }

                    function updateDisplay(){
                        if( window.innerWidth < window.innerHeight ){
                            isLandscape = false;
                            $element.css( { 'left':window.innerWidth, 'width':window.innerHeight, 'height':window.innerWidth, 'position':'absolute', 'transform-origin': 'left top', 'transform': 'rotate(90deg)' });
                        }else{
                            isLandscape = true;
                            $element.css( { 'left':0, 'width':'100%', 'height':'100%', 'position':'relative', 'transform-origin': 'left top', 'transform': 'rotate(0deg)' });
                        }
                        var leverContainerMinsize = Math.min( $leverContainer.width(), $leverContainer.height() );
                        var leverBgSize = leverContainerMinsize * 0.7;
                        var leverSize = leverBgSize * 0.5;
                        $leverBg.css( { 'width': leverBgSize, 'height':leverBgSize, 'margin-left':-leverBgSize/2, 'margin-top':-leverBgSize/2 });
                        $lever.css( {  'width': leverSize, 'height':leverSize, 'margin-left':-leverSize/2, 'margin-top':-leverSize/2 });
                        var position = $lever.position();
                        $lever.data( 'init-position', {x:position.left, y:position.top} );
                    }
                }
            }
        });
}( window.GlobalService );

























