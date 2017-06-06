'use strict';

angular.module('tetris.challengers', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/challengers', {
    templateUrl: 'challengers/challengers.html',
    controller: 'ChallengersCtrl'
  });
}])

.controller('ChallengersCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.challengers = [];

	$scope.getTop = function(){
		$http.post('/top-challengers', {}, {})
		     .then(
		     	function(response){
		     		console.log(response.data);
		     		$scope.challengers = response.data;
		     	}, 
		     	function(error){
		     		console.log(error);
		     	}
		    );
		
	};

	$scope.getTop();

}]);