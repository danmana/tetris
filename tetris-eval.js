/**
 * Created by dmanastireanu on 31-May-17.
 */
var program = require('commander');
var helper = require('./tetris-helper.js');

program
    .option('-p, --pieces <pieces>', 'The pieces this tetris game will use (a string of letters: IJLOSTZ)')
    .option('-m, --moves <moves>', 'The moves this tetris game will make (one move per piece). ' +
        'A move consists of and x and rotation separated by comma. ' +
        'Moves are separated by semicolons - ex: 0:0;3:1;0:1;7:2;)', helper.parseMoves)
    .parse(process.argv);

if (!program.pieces) {
    console.error('Missing --pieces option');
    program.help();
} else if (!program.moves) {
    console.error('Missing --moves option');
    program.help();
} else {
    console.log(helper.getScore(program.pieces, program.moves));
}
