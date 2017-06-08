'use strict';

angular.module('tetrisbot.intro', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/intro', {
    templateUrl: 'intro/intro.html',
    controller: 'IntroCtrl'
  });
}])

.controller('IntroCtrl', ['$scope', function($scope) {

  $scope.SHAPE_NAMES = Tetris.SHAPE_NAMES;

  function showShape(name) {
    var shape = Tetris.clone(Tetris.SHAPES[name]), i, html = '';

    for (i = 0; i < 4; i++) {
      html += '<div class="shape-demo">' + Tetris.gridToHTML(Tetris.rotate(shape, i)) + '</div>';
    }
    console.log(html);

    document.getElementById('shape-demo-' + name).innerHTML = html;
  }

  var i;
  for (i = 0; i < Tetris.SHAPE_NAMES.length; i++) {
    showShape(Tetris.SHAPE_NAMES[i]);
  }


}]);