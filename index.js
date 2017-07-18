/* App necesities */
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');

var program = require('commander');

program
.usage('--port 80 --dir ../tmp')
.option('-p, --port <n>', 'server port number (default 8099)')
.option('-d, --dir <path>', 'directory where to store submissions (default ../tmp)')
.parse(process.argv);

var port = program.port || 8099;
var baseDir = program.dir || '../tmp';

console.log('Using port', port);
console.log('Using dir', baseDir);


/* Disk storage necesities */

var scoreFile = baseDir + "/score.json";
var mkdirp = require('mkdirp');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    var directory = baseDir + "/" + req.body.username;
    mkdirp.sync(directory);
    cb(null, directory);
  },
  filename: function(req, file, cb) {
    var filename = req.body.type + '-' + Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});
var upload = multer({storage: storage})

/* CSV parsing necesities */
var csv = require('csv-parser')
var fs = require('fs')

/* Tetris evaluator necesities */
var helper = require('./tetris-helper.js');

/* App config */
var app = express();

// handle errors
app.use(errorhandler());
process.on('uncaughtException', function(err) {
  // handle the error safely
  console.error(err);
});


app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());


app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

app.post('/top-challengers', function(req, res) {
  var scores = JSON.parse(fs.readFileSync(scoreFile).toString());
  var sortable = [];

  for (var username in scores) {
    sortable.push([username, Math.max.apply(null, scores[username]), scores[username].length]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  var response = [];
  for (var i = 0; i < sortable.length; i++) {
    var entry = sortable[i];
    response.push({email: entry[0], score: entry[1], attempts: entry[2]});
  }
  res.json(response);
});

/* Basic necesities for storing the data */
mkdirp.sync(baseDir);
if (!fs.existsSync(scoreFile)) fs.writeFileSync(scoreFile, "{}");

var games = helper.loadGames();

/* Results storage & evaluator */
app.post('/upload-results', upload.single('results'), function(req, res, next) {

  var username = req.body.username;

  var errors = [];
  var warnings = [];
  var alreadyScored = {};
  var score = 0;

  var fileLocation = req.file.destination + "/" + req.file.filename;

  fs.createReadStream(fileLocation)
  .pipe(csv())
  .on('data', function(data) {
    var gameId = Number(data.game);
    // check if the game id is valid
    if (isNaN(gameId) || gameId < 0 || gameId >= games.length) {
      errors.push('Unknown game number: ' + data.game);
      return;
    }

    // check if the game was already scored (duplicate rows are ignored to avoid cheating)
    if (alreadyScored.hasOwnProperty(gameId)) {
      warnings.push('Duplicate game number: ' + gameId);
      return;
    }
    alreadyScored[gameId] = true;

    var game = games[gameId];
    try {
      score += helper.getScore(game, helper.moveParser(data.moves));
    } catch (e) {
      console.error('Error scoring game ' + gameId + ' for user ' + username + ' in file ' + fileLocation, e);
      errors.push('Error scoring game: ' + gameId);
    }
  })
  .on('end', function() {
    // save the score
    // note: we should really make this atomic ...
    var scores = JSON.parse(fs.readFileSync(scoreFile).toString());
    var userScores = scores[username] || [];
    var maxScoreBefore = Math.max.apply(null, userScores);
    userScores.push(score);
    scores[username] = userScores;
    fs.writeFileSync(scoreFile, JSON.stringify(scores));

    // make a final check to see if all the games were scored
    var scoredGames = 0, g;
    for (g in alreadyScored) {
      if (alreadyScored.hasOwnProperty(g)) {
        scoredGames++;
      }
    }
    if (scoredGames !== games.length) {
      warnings.push('Only ' + scoredGames + ' out of ' + games.length + ' games were scored.');
    }


    // send a response
    res.send({
      score: score,
      maxScoreBefore: maxScoreBefore,
      errors: errors,
      warnings: warnings
    });
  });

});


app.post('/upload-solution', upload.single('solution'), function(req, res, next) {
  res.sendStatus(201);
});

app.listen(port);
console.log("App listening on port " + port);
