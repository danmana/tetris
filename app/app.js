'use strict';

// Declare app level module which depends on views, and components
angular.module('tetrisbot', [
  'ngRoute',
  'tetrisbot.navbar',
  'tetrisbot.intro',
  'tetrisbot.challengers',
  'tetrisbot.solution',
  'tetrisbot.simulator'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/intro'});
}]);
