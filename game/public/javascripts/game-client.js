'use strict';


+function(){
    var TITLE = 'Team Dodge'
    angular.module( 'Game', [ 'ngRoute' ] )
        .config( [ '$routeProvider', function( $routeProvider ){

            $routeProvider.when( '/watingRoom', {
                templateUrl : 'wating-room.html',
                controller : ''
            } )
        }])
        .controller( 'GameController', function( $scope ){
            $scope.title = TITLE;

            $scope.goWatingRoom = function(){

            }
        });
}();
