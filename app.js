//app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mainsRouter = require('./routes/mainsRoutes');
var usersRouter = require('./routes/usersRoutes');
var patientsRouter = require('./routes/patientsRoutes');
var loginRouter = require('./routes/loginRoutes');
var examsRouter = require('./routes/examsRoutes');
var ordersRouter = require('./routes/ordersRoutes');

var auditRoutes = require('./routes/auditRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainsRouter);
app.use('/', loginRouter);
app.use('/', usersRouter);
app.use('/', patientsRouter);
app.use('/', examsRouter);
app.use('/', ordersRouter);
app.use('/', auditRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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







/*
//mejora para que no se cierre la sesion
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mainsRouter = require('./routes/mainsRoutes');
var usersRouter = require('./routes/usersRoutes');
var patientsRouter = require('./routes/patientsRoutes');
var loginRouter = require('./routes/loginRoutes');
var examsRouter = require('./routes/examsRoutes');
var ordersRouter = require('./routes/ordersRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainsRouter);
app.use('/', loginRouter);
app.use('/', usersRouter);
app.use('/', patientsRouter);
app.use('/', examsRouter);
app.use('/', ordersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
*/