var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
var cors = require('cors');
var request = require('request');


var app = express();

//CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
 
app.use(allowCrossDomain);
*/
const myRepeatLogger = function _myRepeatLogger( req, res, next) {
  console.log('');
  console.log("Repeating: " + req.query.url);
  next();
}

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/repeat', myRepeatLogger,function( req, res, next) {
  if(!req.query.url) return res.sendStatus(400);
  var url = req.query.url;
  var r = null;
  try {
    switch (req.method) {
      case 'POST':
        r = request.post({uri: url, json: req.body});  
        break;
      case 'PUT':
        r = request.put({uri: url, json: req.body});
        break;
      case 'DELETE':
        r = request.del({uri: url, json: req.body});
        break;
      default: //GET
        r = request(url);
        break;
    }  
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
  
  req.pipe(r).pipe(res);
})


/* 
app.post('/repeat_old', function(req, res, next) {
  if(!req.body || !req.body.targetURL ) return res.sendStatus(400);
  console.log('');
  console.log("=================================");
  console.log("Repeating: " + req.body.targetURL);
  console.log('');

  axios.get(req.body.targetURL)
  .then( (results) => {
    res.send(results.data);
  } )
  .catch((err) => {
    if( err.response ) console.log(err.response.status);
    else console.log(err);
    res.status(Number(err.response.status)).send(err.code || err.response.status || 'NOCODE_ERROR :(');
  })
})
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
