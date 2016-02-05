
+function(){


    window.AssetManager = {
        loadCommon:_loadCommon,
        loadStageAsset:_loadStageAsset
    };

    function _loadCommon(){
        _loader.loadManifest( getManifast( 'COMMON' ), true, _root );
    }

    function _loadStageAsset( level ){
        _loader.loadManifest( getManifast( 'STAGE.'+level ), true, _root );
    }

    var RESOURCE_MANIFAST = {
        COMMON:{
            USER:[
                {src: "img/character-sprite01.png", id: "cs1"},
                {src: "img/character-sprite02.png", id: "cs2"}
            ],
            BGM:[

            ]
        },
        STAGE:[
            [{src: "img/enemy-sprite01.png", id: "es1"}],
            [{src: "img/enemy-sprite01.png", id: "es2"}],
            [{src: "img/enemy-sprite01.png", id: "es3"}]
        ]
    };

    var _loader = new createjs.LoadQueue(false);
    var _root = '/assets/';

    function getManifast( key ){
        var result = [];
        var resource =  RESOURCE_MANIFAST[ key ];
        for( var prop in resource ){
            result.concat( resource[ prop ] );
        }
        return result;
    }

    /*
    loader.loadManifest(manifast, true, "/assets/");
    loader.addEventListener("complete", function(){
        initUser( usersInfo );
        initEnemy();
        initGameLoop();
    });
    */


}()