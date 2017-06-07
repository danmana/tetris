'use strict';

angular.module('tetrisbot.simulator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/simulator', {
    templateUrl: 'simulator/simulator.html',
    controller: 'SimulatorCtrl'
  });
}])

.controller('SimulatorCtrl', ['$scope', function($scope) {


	var t = new Tetris('IJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZ');
	var display = document.getElementById('display');

    $scope.autoplay = setInterval(function () {
        t.makeMove(Math.floor(Math.random() * 7), Math.floor(Math.random() * 3));
        display.innerHTML = t.toHtml();
        if (t.won || t.lost) {
            clearInterval(autoplay);
        }

    }, 500);
	

}]);