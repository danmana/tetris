/* App necesities */
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


var args = require('minimist')(process.argv.slice(2), {
  alias: {
    'p': 'port',
    'd': 'dir',
    'h': 'help'
  }
});

var port = args.port || 8099;
var baseDir = args.dir || "../tmp";

if (args.h || args.help) {
  console.log('usage: node index.js [-p 80] [-d ../tmp] [-h] \n\n' +
  'Arguments:\n' +
  '  -p, --port 8099         sets the server port\n' +
  '  -d, --dir ../tmp        sets the directory where to store submissions\n' +
  '  -h, --help              prints this help message');
  return;
}

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
var tetris = require('./tetris-helper.js');

/* App config */
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

/* Results storage & evaluator */
app.post('/upload-results', upload.single('results'), function(req, res, next) {

  var username = req.body.username;
  var scores = JSON.parse(fs.readFileSync(scoreFile).toString());
  var existings = scores[username] || [];

  var score = 0;
  fs.createReadStream(req.file.destination + "/" + req.file.filename)
  .pipe(csv())
  .on('data', function(data) {
    score = score + tetris.getScore(data.game, tetris.moveParser(data.moves));
  })
  .on('end', function() {
    existings.push(score);
    scores[username] = existings;
    fs.writeFileSync(scoreFile, JSON.stringify(scores));
    res.send({score: score});
  });

});


app.post('/upload-solution', upload.single('solution'), function(req, res, next) {
  res.sendStatus(201);
});

app.listen(port);
console.log("App listening on port " + port);
