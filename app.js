var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var createaccount = require('./routes/createaccount');
var account = require('./routes/account');
var portal = require('./routes/portal');
var uploadQ = require('./routes/uploadQ');
var gettest = require('./routes/gettest');
var submittest = require('./routes/submittest');
var createtest = require('./routes/createtest');
var test = require('./routes/test');
var createt = require('./routes/createt');
var profile = require('./routes/profile');
var getprofile = require('./routes/getprofile');
var instructions = require('./routes/instructions');
var timeline = require('./routes/timeline');
var testresult = require('./routes/testresult');
var home = require('./routes/home');
var userlogout = require('./routes/userlogout');
var followuser = require('./routes/followuser');
var getfollowers = require('./routes/getfollowers');
var getfollowing = require('./routes/getfollowing');
var getusersuggestions = require('./routes/getusersuggestions');
var getprogress = require('./routes/getprogress');
var gate = require('./routes/gate');
var jee = require('./routes/jee');
var practice = require('./routes/practice');
var getpractice = require('./routes/getpractice');
var gettimeline = require('./routes/gettimeline');
var getusersearchresults = require('./routes/getusersearchresults');
var getpostsearchresults = require('./routes/getpostsearchresults');
var searchresults = require('./routes/searchresults');
var getinstructions = require('./routes/getinstructions');
var isfollowing = require('./routes/isfollowing');

var app = express();

// view engine setup
app.use(session({
    secret: 'edsonet123',
    resave: true,
    saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/users', users);
app.use('/signup', signup);
app.use('/login', login);
app.use('/createaccount', createaccount);
app.use('/account', account);
app.use('/portal', portal);
app.use('/uploadQ', uploadQ);
app.use('/gettest', gettest);
app.use('/submittest', submittest);
app.use('/createtest', createtest);
app.use('/test', test);
app.use('/createt', createt);
app.use('/profile', profile);
app.use('/getprofile', getprofile);
app.use('/instructions', instructions);
app.use('/timeline', timeline);
app.use('/testresult', testresult);
app.use('/home', home);
app.use('/userlogout', userlogout);
app.use('/followuser', followuser);
app.use('/getfollowers', getfollowers);
app.use('/getfollowing', getfollowing);
app.use('/getprogress', getprogress);
app.use('/gate', gate);
app.use('/practice', practice);
app.use('/getpractice', getpractice);
app.use('/gettimeline', gettimeline);
app.use('/getusersuggestions', getusersuggestions);
app.use('/getusersearchresults', getusersearchresults);
app.use('/getpostsearchresults', getpostsearchresults);
app.use('/searchresults', searchresults);
app.use('/getinstructions', getinstructions);
app.use('/jee', jee);
app.use('/isfollowing', isfollowing);

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
