var Tetris = require('./tetris.js');
var fs = require('fs');

exports.getScore = function(pieces, moves) {
  var tetris = new Tetris(pieces);
  var i, move;

  if (typeof moves === 'string') {
    moves = Tetris.parseMoves(moves);
  }

  for (i = 0; i < moves.length; i++) {
    move = moves[i];
    tetris.makeMove(move.x, move.rot);
    if (tetris.won || tetris.lost) {
      return tetris.score;
    }
  }

  return tetris.score;
};

exports.parseMoves = Tetris.parseMoves;

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

exports.generateGameTrueRandom = function(pieces, length) {
  var game = [];

  while (game.length < length) {
    game.push(pieces[Math.floor(Math.random() * pieces.length)]);
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
exports.loadGames = function(filePath) {
  return fs.readFileSync(filePath).toString().split('\n');
};