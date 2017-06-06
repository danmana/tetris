var Tetris = require('./tetris.js');

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