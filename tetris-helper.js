var Tetris = require('./tetris.js');
var fs = require('fs');

exports.getScore = function(pieces, moves) {
  var tetris = new Tetris(pieces);
  var i, move;
  for (i = 0; i < moves.length; i++) {
    move = moves[i];
    tetris.makeMove(move.x, move.rot);
    if (tetris.won || tetris.lost) {
      return tetris.score;
    }
  }

  return tetris.score;
};

exports.moveParser = function(val) {
  var moves = [];
  var moveStrings = val.split(';'), i, parts;
  for (i = 0; i < moveStrings.length; i++) {
    parts = moveStrings[i].split(',');
    moves.push({
      x: parseInt(parts[0]),
      rot: parseInt(parts[1])
    });
  }
  return moves;
};

exports.generateGame = function(pieces, length) {
  var game = [];
  var bag = [];

  while (game.length < length) {
    if (!bag.length) {
      bag = permute(pieces.split(''));
    }
    game.push(bag.pop());
  }

  return game.join('');
};

function permute(input) {
  var idx, swpIdx, tmp, perm;
  // clone the array
  perm = input.slice();

  for (idx = 0; idx < perm.length; idx++) {
    swpIdx = idx + Math.floor(Math.random() * (perm.length - idx));

    // now swap elements at idx and swpIdx
    tmp = perm[idx];
    perm[idx] = perm[swpIdx];
    perm[swpIdx] = tmp;
  }
  return perm;
}

/**
 * Load all games form the games.txt file
 */
exports.loadGames = function() {
  return fs.readFileSync('./app/games.txt').toString().split('\n');
};