'use strict';

angular.module('tetrisbot.solution', ['ngRoute', 'ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/solution', {
    templateUrl: 'solution/solution.html',
    controller: 'SolutionCtrl'
  });
}])

.controller('SolutionCtrl', ['$scope', '$timeout', '$location', 'Upload', function ($scope, $timeout, $location, Upload) {
	$scope.uploadSolution = function(resultsFile, solutionFile) {
		var username = $scope.contestantEmail.substr(0, $scope.contestantEmail.indexOf('@'));

		resultsFile.upload = Upload.upload({
      		url: '/upload-results',
      		data: {username: username, type:"results", results: resultsFile}
    	});

    	resultsFile.upload.then(
	      function (response) {
		      $timeout(function () {
		        resultsFile.result = response.data;
		        alert("On this solution you've scored: " + response.data.score + " points! \nCongratulations!");
		        $location.path('/challengers');
		      });
	    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
	    }, function (evt) {
		      resultsFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	    });


    	if(solutionFile){
		    solutionFile.upload = Upload.upload({
	      		url: '/upload-solution',
	      		data: {username: username, type:"solution", solution: solutionFile}
	    	});
		    solutionFile.upload.then(
		      function (response) {
			      $timeout(function () {
			        solutionFile.result = response.data;
			      });
		    }, function (response) {
			      if (response.status > 0)
			        $scope.errorMsg = response.status + ': ' + response.data;
		    }, function (evt) {
			      solutionFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		    });
	    }
	};



}]);