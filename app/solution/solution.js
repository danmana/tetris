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
		resultsFile.upload = Upload.upload({
      		url: '/upload-results',
      		data: {username: $scope.contestantEmail, type:"results", results: resultsFile}
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
		      // Math.min is to fix IE which reports 200% sometimes
		      resultsFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	    });


    	if(solutionFile){
		    solutionFile.upload = Upload.upload({
	      		url: '/upload-solution',
	      		data: {username: $scope.contestantEmail, type:"solution", solution: solutionFile}
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
			      // Math.min is to fix IE which reports 200% sometimes
			      solutionFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		    });
	    }
	};



}]);