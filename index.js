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
.option('-w, --winners <n>', 'number of winners (default 3)')
.option('-e, --end <date>', 'end date (default 17 Sep 2017 23:59:59)')
.parse(process.argv);

var port = program.port || 8099;
var baseDir = program.dir || '../tmp';
var winners = program.winners || 3;
var endDate = program.end ? new Date(program.end) : new Date('17 Sep 2017 23:59:59');

console.log('Using port', port);
console.log('Using dir', baseDir);
console.log('Using winners', winners);
console.log('Using endDate', endDate);


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

function isCompetitionOver() {
  return new Date() > endDate;
}

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    if (req.body.type === 'results' && isCompetitionOver()) {
      cb(null, false);
      return;
    }
    cb(null, true);

  }
});

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
  var response = [],i;

  for (var username in scores) {
    if (scores.hasOwnProperty(username)) {
      var userScores = scores[username];
      var best = getBestScore(userScores);

      response.push({
        email: username,
        score: best.value,
        scoreDate: best.date,
        attempts: userScores.length,
        inTheMoney: false
      });
    }
  }

  response.sort(function(a, b) {
    // sort by score desc
    var cmp = b.score - a.score;
    // sort equal scores by date asc
    if (cmp === 0) {
      cmp = a.date - b.date;
    }
    return cmp;
  });

  for (i = 0; i < winners && i < response.length; i++) {
    response[i].inTheMoney = true;
  }

  res.json(response);
});

function getBestScore(scores) {
  var best = {
    value: 0,
    date: new Date()
  }, i, s;

  for (i=0;i<scores.length;i++) {
    s = scores[i];
    if (s.value > best.value) {
      best = s;
    } else if (s.value === best.value && s.date < best.date) {
      // keep the first score
      best = s;
    }
  }

  return best;
}

/* Basic necesities for storing the data */
mkdirp.sync(baseDir);
if (!fs.existsSync(scoreFile)) fs.writeFileSync(scoreFile, "{}");

var games = helper.loadGames('./app/games.txt');

/* Results storage & evaluator */
app.post('/upload-results', upload.single('results'), function(req, res, next) {

  if (!req.file) {
    res.send({
      score: 0,
      maxScoreBefore: 0,
      errors: [isCompetitionOver() ? 'Competition is over. Solution submission is disabled.' : 'Error uploading file.'],
      warnings: []
    });
    return;
  }

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
      score += helper.getScore(game, helper.parseMoves(data.moves));
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
    var best = getBestScore(userScores);
    userScores.push({
      value: score,
      date: new Date()
    });
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
      maxScoreBefore: best.value,
      errors: errors,
      warnings: warnings
    });
  });

});

app.get('/info', function(req, res, next) {
  res.send({
    winners: winners,
    endDate: endDate
  });
});

app.post('/upload-solution', upload.single('solution'), function(req, res, next) {
  res.sendStatus(201);
});

app.listen(port, '0.0.0.0', function() {
  console.log("App listening on port " + port);
});

