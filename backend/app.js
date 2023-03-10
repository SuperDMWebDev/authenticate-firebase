var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var middleware = require('./src/middleware/index');
var connection = require('./db/db');
const cors = require('cors');
var indexRouter = require('./routes/index');
var taskRouter = require('./routes/task');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
connection.connectDB();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine as EJS
// app.engine('html', require('ejs').renderFile);

app.use(middleware.decodeToken);
app.use('/api/authorize', indexRouter);
app.use('/api/tasks',taskRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
