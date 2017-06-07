'use strict';

angular.module('tetrisbot.simulator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/simulator', {
    templateUrl: 'simulator/simulator.html',
    controller: 'SimulatorCtrl'
  });
}])

.controller('SimulatorCtrl', ['$scope', function($scope) {

    $scope.pieces = "OOOOOOOIIOO";
    $scope.moves = "0,0;2,0;4,0;6,0;0,0;8,0;0,0;2,0;4,0;6,0;0,0;8,0";
	var t, moves = [];
	var display = document.getElementById('display');

    $scope.play = function (){
        t = new Tetris($scope.pieces); moves = [];

        var moveStrings = $scope.moves.split(';'), i, parts;
        for (i = 0; i < moveStrings.length; i++) {
            parts = moveStrings[i].split(',');
            moves.push({
                x: parseInt(parts[0]),
                rot: parseInt(parts[1])
            });
        } 

        var autoplay = setInterval(function () {
            var nextMove = moves.shift();
            if(nextMove) {
                t.makeMove(nextMove.x, nextMove.rot);
            }
            display.innerHTML = t.toHtml();
            if (t.won || t.lost || nextMove === undefined) {
                clearInterval(autoplay);
            }

        }, 500); 
    };
}]);