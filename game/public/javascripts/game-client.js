'use strict';

+function(){
    angular.module( 'Game', [ 'ngRoute'] )
        .config( [ '$routeProvider' ,function( $routeProvider ){
            $routeProvider
                .when( '/home', { templateUrl:'./views/home.html'})
                .when( '/ready', { templateUrl : 'views/ready.html',  controller : 'Ready' })
                .otherwise( { 'redirectTo' : '/home' });
        }])
        .factory( 'socketio', ['$rootScope', function( $rootScope ){
            var socketio = io();
            return {
                on:function( eventName, callback ){
                    socketio.on( eventName, function(){
                        var args = arguments;
                        $rootScope.$apply( function(){
                            callback.apply( socketio, args );
                        });
                    });
                },
                emit:function( eventName, data, callback ){
                    socketio.emit( eventName, data, function(){
                        var args = arguments;
                        $rootScope.$apply( function(){
                            callback.apply( socketio, args );
                        });
                    } );
                }
            }
        }])
        .controller( 'Ready', [ '$scope', '$http', 'socketio', function( $scope, $http, socketio ){
            $http( { 'method':'GET', 'url':'/getkey'}).then(
                function( res ){
                    var key = res.data;
                    $scope.url = location.host + '/room/' + key;
                    socketio.emit( 'create-room', key, function(){} );
                    socketio.on( 'create')
                },
                function(){ console.log('fail') }
            );
        }]);
}();
