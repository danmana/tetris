var Tetris = require('../tetris');
var helper = require('../tetris-helper');
var fs = require('fs');

var games = helper.loadGames('../app/games.txt');
var solutions = ['game,moves'];
var totalScore = 0;

games.forEach(function(game, gameId) {
  var moves = [];
  var shapes = game.split('');

  var t = new Tetris(game);

  shapes.forEach(function(shape) {

    // TODO: implement your logic here and choose the best move
    // You can use t.clone(), t.makeMove() and t.score to try out moves and see their score

    // choose a random rotation between 0 and 3
    var rot = Math.floor(Math.random() * 4);
    // choose a random position between 0 and GRID_W
    var x = Math.floor(Math.random() * (Tetris.GRID_W));


    var move = x + ':' + rot;
    moves.push(move);
  });

  moves = moves.join(';');

  var score = helper.getScore(game, moves);
  console.log('Game: ' + gameId + ' Score: ' + score);
  totalScore += score;

  var solution = gameId + ',' + moves;
  solutions.push(solution);
});


var outputDir = './solutions/';
var outputFile = outputDir + 'solution-' + new Date().getTime() + '.csv';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}
fs.writeFile(outputFile, solutions.join('\n'), function(err) {
  if (err) {
    return console.log(err);
  }

  console.log('Saved solutions in ' + outputFile + '\nTotal Score: ' + totalScore);
});



