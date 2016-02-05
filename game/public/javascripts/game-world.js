
+function( GlobalService, AssetManager ){ 'use strict';
    gameWorld.$inject = [ '$rootScope' ];
    function gameWorld ( $rootScope ){

        var _canvas;
        var _canvasWidth;
        var _canvasHeight;
        var _stage;
        var _usersInfo;
        var _userList;
        var _userCharacters = [];
        var _enemyPool = [];
        var _loader = new createjs.LoadQueue(false);
        var _FPS = 40;
        var _MANIFAST = [
            {src: "img/character-sprite01.png", id: "cs1"},
            {src: "img/character-sprite02.png", id: "cs2"},
            {src: "img/enemy-sprite01.png", id: "es1"}
        ];

        function preload(){
            loader.loadManifest(manifast, true, "/assets/");
            loader.addEventListener("complete", function(){
                initUser( usersInfo );
                initEnemy();
                initGameLoop();
            });
        }

        function createUser( userListData ){
            _userList = [];
            for( var i= 0, count=userListData.length ; i<count ; i+=1 ){
                _userList.push( createActor( userListData[ i ] ) );
            }
        }

        function createActor( data, type ){

        }

        return {
            init:function( canvas, stage ){
                _canvas = canvas;
                _canvasWidth = canvas.width;
                _canvasHeight = canvas.height;
            },
            goStage:function(){

            },
            start:function(){

            },
            pause:function(){

            },
            setUserList:function( userList ){
                createUser( userList );
            }
        }
    }

    GlobalService.gameWorld = gameWorld;

}( window.GlobalService || ( window.GlobalService = {} ), window.AssetManager )
