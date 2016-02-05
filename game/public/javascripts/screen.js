
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
        .factory( 'gameWorld', GlobalService.gameWorld )

        .controller( 'ScreenBase', [ '$scope', 'socketio', function( $scope, socketio ){
            $scope.io = socketio;
            $scope.usersInfo = [];
            $scope.usersMap = {};
            $scope.setUserData = function( data ){
                $scope.usersInfo = data;
                for( var i= 0, count = $scope.usersInfo.length ; i<count ; i+=1 ){
                    var user = $scope.usersInfo[ i ];
                    $scope.usersMap[ user.id ] = user;
                }
            }
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
                $scope.setUserData( usersInfo );
                $location.path( '/game-world' );
            });
        }])

        .controller( 'GameWorld', [ '$scope', function( $scope ){
            $scope.io.on( 'updateVector', function( data ){
                var vector = $scope.usersMap[ data.id].vector;
                vector.radian = data.radian;
                vector.length = data.length;
            });
        }])

        .directive( 'gameWorld', ['gameWorld', function( gameWorld ){
            return{
                restrict:'E',
                transclude: true,
                controller: 'GameWorld',
                scope:true,
                template:'<div class="wrapper" ng-transclude></div>',
                link:function( $scope, $element, attrs, controller ){
                    var canvas = $element.find( '#game-canvas').get( 0 );
                    gameWorld.init( canvas, 1 );
                    $scope.gameWolrd = gameWorld;
                    preload();


                    function initGameLoop(){
                        createjs.Ticker.frameRate = FPS;
                        createjs.Ticker.addEventListener( 'tick', update );
                    }

                    function initUser( usersInfo ){
                        for( var i= 0, count = usersInfo.length ; i<count ; i+=1 ){
                            userCharacters.push( createUser( usersInfo[ i ], i ) );
                        }
                    }

                    function createUser( user, index  ){
                        var spriteSize = 32;
                        var aniStartIndex = 36;
                        var moveAni = [ 36, 38, 'move', 0.5 ];
                        var aniLength = 3;
                        var aniSpeed = 0.5;
                        moveAni[ 0 ] = aniStartIndex + ( aniLength*index );
                        moveAni[ 1 ] = moveAni[ 0 ] + aniLength - 1;
                        moveAni[ 2 ] = 'move';
                        moveAni[ 3 ] = aniSpeed;
                        var spriteSheet = new createjs.SpriteSheet({
                            images:[loader.getResult("cs1")],
                            frames:{ height: spriteSize, width: spriteSize },
                            animations:{
                                move:moveAni
                            }
                        });
                        var sprite = new createjs.Sprite( spriteSheet, 'move' );
                        var x = ( canvas.width - spriteSize )/2;
                        var y = canvas.height - spriteSize - 20;
                        sprite.x = x;
                        sprite.y = y;
                        stage.addChild( sprite );
                        return { sprite:sprite, size:spriteSize, radian:0, length:0,  speed:7 };
                    }

                    function initEnemy(){
                        for( var i= 0; i<100 ; i+=1 ){
                            enemyPool.push( createEnemy() );
                        }
                    }

                    function createEnemy(){
                        var spriteSize = 32;
                        var aniStartIndex = 36;
                        var moveAni = [ 0, 2, 'move', 0.5 ];
                        var aniLength = 3;
                        var aniSpeed = 0.5;
                        moveAni[ 0 ] = aniStartIndex + ( aniLength*index );
                        moveAni[ 1 ] = moveAni[ 0 ] + aniLength - 1;
                        moveAni[ 2 ] = 'move';
                        moveAni[ 3 ] = aniSpeed;
                        var spriteSheet = new createjs.SpriteSheet({
                            images:[loader.getResult("es1")],
                            frames:{ height: spriteSize, width: spriteSize },
                            animations:{
                                move:moveAni
                            }
                        });
                        var sprite = new createjs.Sprite( spriteSheet, 'move' );
                        var x = ( canvas.width - spriteSize ) * Math.random();
                        var y = 0;
                        sprite.x = x;
                        sprite.y = y;
                        stage.addChild( sprite );
                        return { sprite:sprite, size:spriteSize, radian:Math.PI/2, length:1,  speed:2+5*Math.random() };
                    }

                    function update(){
                        for( var i= 0, count = usersInfo.length ; i<count ; i+=1 ){
                            updateUser( usersInfo[ i ], i );
                        }
                        stage.update();
                    }

                    function updateUser( userInfo, index ){
                        var userCharacter = userCharacters[ index ];
                        var sprite = userCharacter.sprite;
                        userCharacter.length = userCharacter.speed * userInfo.vector.length;
                        userCharacter.radian = userInfo.vector.radian;

                        var x = userCharacter.length * Math.cos( userCharacter.radian );
                        var y = userCharacter.length * Math.sin( userCharacter.radian );
                        if( sprite.x+x < 0 || sprite.x+x > canvasWidth-userCharacter.size ){ x=0; }
                        if( sprite.y+y < 0 || sprite.y+y > canvasHeight-userCharacter.size ){ y=0; }
                        sprite.x += x;
                        sprite.y += y;
                    }
                }
            }
        }]);
}( window.GlobalService );
