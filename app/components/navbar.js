'use strict';

angular.module('tetrisbot.navbar', []).directive('navbar', [ function() {
 	return {
 		restrict: 'AE',
        replace: true,
        transclude: false,
        scope: {},
        templateUrl: "components/navbar.html",
        controller: ['$scope', '$location', function ($scope, $location) {
 					$scope.collapsed = true;
        	
        	var currentPath = $location.path();
        	if(currentPath.indexOf("intro") > -1) $scope.active="intro";
        	if(currentPath.indexOf("challengers") > -1) $scope.active="top";
        	if(currentPath.indexOf("solution") > -1) $scope.active="solution";
        	if(currentPath.indexOf("simulator") > -1) $scope.active="simulator";


        }]
 	};

}]);