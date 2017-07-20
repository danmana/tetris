'use strict';

angular.module('tetrisbot.simulator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/simulator', {
    templateUrl: 'simulator/simulator.html',
    controller: 'SimulatorCtrl'
  });
}])

.controller('SimulatorCtrl', ['$scope', function($scope) {

    $scope.pieces = "LSTSITS";
    $scope.moves = "0:0;2:1;5:0;6:1;8:1;4:2;0:0";

    var autoplay;

    $scope.play = function (){
        var t = new Tetris($scope.pieces);
        var moves = Tetris.parseMoves($scope.moves);
        var display = document.getElementById('display');

        if (autoplay) {
          clearInterval(autoplay);
        }

        autoplay = setInterval(function () {
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