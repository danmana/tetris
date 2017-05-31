/**
 * Created by dmanastireanu on 31-May-17.
 */
var program = require('commander');
var Tetris = require('./tetris.js');

function moveParser(val) {
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
}

function getScore(pieces, moves) {
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
}


program
    .option('-p, --pieces <pieces>', 'The pieces this tetris game will use (a string of letters: IJLOSTZ)')
    .option('-m, --moves <moves>', 'The moves this tetris game will make (one move per piece). ' +
        'A move consists of and x and rotation separated by comma. ' +
        'Moves are separated by semicolons - ex: 0,0;3,1;0,1;7,2;)', moveParser)
    .parse(process.argv);

if (!program.pieces) {
    console.error('Missing --pieces option');
    program.help();
} else if (!program.moves) {
    console.error('Missing --moves option');
    program.help();
} else {
    console.log(getScore(program.pieces, program.moves));
}
