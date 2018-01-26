var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
var cors = require('cors');
var morgan = require('morgan')
var request = require('request');
var url = require('url');


var app = express();

//Axios logging
axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})

axios.interceptors.response.use(response => {
  console.log('Response:', response.status, response.config.url)
  return response
})

//CORS
app.use(cors());

//Logging
app.use(morgan('dev'));

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

app.get('/1/repeat', myRepeatLogger,function( req, res, next) {
  if(!req.query.url) return res.sendStatus(400);
  const targetUrl = url.parse(req.query.url);
  var r = request({ uri: targetUrl });
  
  r.pipe(res);
})


app.get('/2/repeat',myRepeatLogger,  function(req, res, next) {

  axios.get( url.parse(req.query.url).href )
  .then( (results) => {
    res.send(results.data);
  } )
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.sendStatus(error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return res.sendStatus(502);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      return res.status(500).send(error.message);
    }
  })
})


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
