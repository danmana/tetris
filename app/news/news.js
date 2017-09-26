'use strict';

angular.module('tetrisbot.news', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/news', {
    templateUrl: 'news/news.html',
    controller: 'NewsCtrl'
  });
}])

.controller('NewsCtrl', ['$scope', '$http', function($scope, $http) {

}]);