var Tetris = require('../tetris');
var helper = require('../tetris-helper');
var fs = require('fs');

var games = helper.loadGames('../app/games.txt');
var solutions = ['game,moves'];
var totalScore = 0;

games.forEach(function(game, gameId) {
  var moves = [], shapes = game.split('');
  shapes.forEach(function(shape) {
    moves.push(getBestMove(shape));
  });
  solutions.push(gameId + ',' + moves);
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



