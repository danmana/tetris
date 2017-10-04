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
  $scope.t = new Tetris($scope.pieces);
  $scope.playing = false;

  var moves = Tetris.parseMoves($scope.moves);
  var display = document.getElementById('display');
  display.innerHTML = $scope.t.toHtml();

  var autoplay;

  $scope.hasNext = function() {
    return $scope.t.shapeIndex < $scope.t.nextShapes.length;
  };

  $scope.isOver = function() {
    return $scope.t.won || $scope.t.lost;
  };

  $scope.reset = function() {
    clearInterval(autoplay);
    $scope.playing = false;
    $scope.t = new Tetris($scope.pieces);
    moves = Tetris.parseMoves($scope.moves);
    display.innerHTML = $scope.t.toHtml();
  };

  $scope.play = function() {
    if ($scope.isOver()) {
      $scope.reset();
    }
    $scope.playing = true;

    autoplay = setInterval(function() {
      $scope.$apply(function() {
        $scope.playOne();

        if ($scope.isOver() || !moves.length) {
          $scope.playing = false;
          clearInterval(autoplay);
        }
      });
    }, 500);
  };

  $scope.pause = function() {
    $scope.playing = false;
    clearInterval(autoplay);
  };

  $scope.playOne = function() {
    if ($scope.isOver()) {
      $scope.reset();
      return;
    }
    var nextMove = moves.shift();
    if (nextMove) {
      $scope.t.makeMove(nextMove.x, nextMove.rot);
    }
    display.innerHTML = $scope.t.toHtml();
  };

  $scope.jump = function() {
    var step = Number(prompt('Jump to step (min = ' + ($scope.t.shapeIndex + 1) + ', max = ' + $scope.t.nextShapes.length+')'));
    if (!isNaN(step) && step > $scope.t.shapeIndex && step <= $scope.t.nextShapes.length) {
      while (!$scope.isOver() && $scope.t.shapeIndex < step) {
        var nextMove = moves.shift();
        if (nextMove) {
          $scope.t.makeMove(nextMove.x, nextMove.rot);
        }
      }
      display.innerHTML = $scope.t.toHtml();
    }


  };

}]);