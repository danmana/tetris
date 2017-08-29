'use strict';

angular.module('tetrisbot.challengers', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/challengers', {
    templateUrl: 'challengers/challengers.html',
    controller: 'ChallengersCtrl'
  });
}])

.controller('ChallengersCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.challengers = [];

  $http.get('/info')
  .then(function(response) {
    $scope.info = response.data;
  }, function(error) {
    console.log(error);
  }
  );

	$scope.getTop = function(){
		$http.post('/top-challengers', {}, {})
		     .then(
		     	function(response){
		     		$scope.challengers = response.data;
		     	}, 
		     	function(error){
		     		console.log(error);
		     	}
		    );
		
	};

	$scope.getTop();

}]);