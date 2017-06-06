'use strict';

angular.module('tetris').directive('navbar', [ function() {
 	return {
 		restrict: 'AE',
        replace: true,
        transclude: false,
        scope: {},
        templateUrl: "components/navbar.html",
        controller: ['$scope', function ($scope) {}]
 	};

}]);