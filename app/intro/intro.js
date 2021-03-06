'use strict';

angular.module('tetrisbot.intro', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/intro', {
    templateUrl: 'intro/intro.html',
    controller: 'IntroCtrl'
  });
}])

.controller('IntroCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.SHAPE_NAMES = Tetris.SHAPE_NAMES;

  $http.get('/info')
  .then(function(response) {
    $scope.info = response.data;
  }, function(error) {
    console.log(error);
  }
  );

  function showShape(name) {
    var shape = Tetris.clone(Tetris.SHAPES[name]), i, html = '';

    for (i = 0; i < 4; i++) {
      html += '<div class="shape-demo">' + Tetris.gridToHTML(Tetris.rotate(shape, i)) + '</div>';
    }
    document.getElementById('shape-demo-' + name).innerHTML = html;
  }

  var i;
  for (i = 0; i < Tetris.SHAPE_NAMES.length; i++) {
    showShape(Tetris.SHAPE_NAMES[i]);
  }

  var pieces = "LSTSITSLSTSITSLSTSITS";
  var movesString = "0:0;2:1;5:0;6:1;8:1;4:2;0:0;0:0;2:1;5:0;6:1;8:1;4:2;0:0;0:0;2:1;5:0;6:1;8:1;4:2;0:0";
  var moves = Tetris.parseMoves(movesString);
  var display = document.getElementById('live-demo');
  var t = new Tetris(pieces);

  var autoplay;

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
      moves = Tetris.parseMoves(movesString);
      t = new Tetris(pieces);
    }
  }, 500);
  $scope.$on("$destroy", function() {
    clearInterval(autoplay);
  });


}]);