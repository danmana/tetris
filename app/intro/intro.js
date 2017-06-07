'use strict';

angular.module('tetrisbot.intro', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/intro', {
    templateUrl: 'intro/intro.html',
    controller: 'IntroCtrl'
  });
}])

.controller('IntroCtrl', ['$scope', function($scope) {

	

}]);