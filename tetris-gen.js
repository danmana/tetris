var program = require('commander');
var helper = require('./tetris-helper.js');
var fs = require('fs');

program
    .option('-o, --out <file>', 'The output file where to write the generated games')
    .parse(process.argv);

if (!program.out) {
    console.error('Missing --out option');
    program.help();
} else {
    var games = [];

    // LEVEL 0 - trivial games
    games.push(helper.generateGame('O', 30));
    games.push(helper.generateGame('I', 30));
    games.push(helper.generateGame('T', 30));
    games.push(helper.generateGame('S', 30));
    games.push(helper.generateGame('Z', 30));
    games.push(helper.generateGame('OI', 30));
    games.push(helper.generateGame('OI', 30));
    games.push(helper.generateGame('SZ', 30));
    games.push(helper.generateGame('SZ', 30));
    games.push(helper.generateGame('SZ', 30));

    // LEVEL 1 - easy games
    games.push(helper.generateGame('OIT', 50));
    games.push(helper.generateGame('OIT', 50));
    games.push(helper.generateGame('OIT', 50));
    games.push(helper.generateGame('SZT', 50));
    games.push(helper.generateGame('SZT', 50));
    games.push(helper.generateGame('SZT', 50));
    games.push(helper.generateGame('OISZ', 50));
    games.push(helper.generateGame('OISZ', 50));
    games.push(helper.generateGame('OISZ', 50));
    games.push(helper.generateGame('OISZ', 50));

    // LEVEL 2 - medium games
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));
    games.push(helper.generateGame('IJLOSTZ', 100));

    // LEVEL 3 - hard games
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));
    games.push(helper.generateGame('IJLOSTZ', 1000));

    // LEVEL 4 - extreme games
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));
    games.push(helper.generateGame('IJLOSTZ', 10000));

    fs.writeFile(program.out, games.join('\n'), function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('Saved ' + games.length + ' games in ' + program.out);
    });


}
