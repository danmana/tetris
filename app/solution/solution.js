'use strict';

angular.module('tetrisbot.solution', ['ngRoute', 'ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/solution', {
    templateUrl: 'solution/solution.html',
    controller: 'SolutionCtrl'
  });
}])

.controller('SolutionCtrl', ['$scope', '$timeout', '$location', 'Upload', 'ngDialog', function($scope, $timeout, $location, Upload, ngDialog) {

  var endDate = new Date('17 Sep 2017 23:59:59');
  $scope.competitionOver = new Date() > endDate;

  $scope.files = {};

  $scope.uploadSolution = function(resultsFile, solutionFile) {
    var username = $scope.contestantEmail.substr(0, $scope.contestantEmail.indexOf('@'));

    if (resultsFile) {
      resultsFile.upload = Upload.upload({
        url: '/upload-results',
        data: {username: username, type: "results", results: resultsFile}
      });

      resultsFile.upload.then(
      function(response) {
        $timeout(function() {
          resultsFile.result = response.data;
          var dialog = ngDialog.open({
            template: 'solution/upload_result.html',
            className: 'ngdialog-theme-default',
            data: response.data
          });
          dialog.closePromise.then(function(data) {
            $location.path('/challengers');
          });
        });
      }, function(response) {
        if (response.status > 0) {
          $scope.errorMsg = response.status + ': ' + response.data;
          $timeout(function() {
            ngDialog.open({
              template: '<p class="text-error">Upload failed!</p>',
              plain: true
            });
          });
        }
      }, function(evt) {
        resultsFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }


    if (solutionFile) {
      solutionFile.upload = Upload.upload({
        url: '/upload-solution',
        data: {username: username, type: "solution", solution: solutionFile}
      });
      solutionFile.upload.then(
      function(response) {
        $timeout(function() {
          ngDialog.open({
            template: '<p>Description uploaded</p>',
            plain: true
          });
        })
      }, function(response) {
        if (response.status > 0) {

          $scope.errorMsg = response.status + ': ' + response.data;
          $timeout(function() {
            ngDialog.open({
              template: '<p class="text-error">Upload failed!</p>',
              plain: true
            });
          });
        }
      }, function(evt) {
        solutionFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  };


}]);