var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var port = process.env.PORT || 8080;
var app = express();

app.set('port', port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/javascripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/javascripts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/')));
app.use('/stylesheets', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));
app.use('/stylesheets', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free/css/')));
app.use('/webfonts', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free/webfonts/')));

app.use('/', indexRouter);

app.get('*', (req, res) => res.redirect('/'));

app.listen(port);
