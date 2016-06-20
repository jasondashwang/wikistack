
var express = require('express');
var swig = require('swig');
var routes = require('./routes');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

var logger = morgan('dev');
var app = new express();


app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests


app.engine('html', swig.renderFile); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
app.set('views', path.join(__dirname, '/views')); // where to find the views
swig.setDefaults({ cache: false });

app.use(logger);

var server = app.listen(3000, function(){
  console.log('Server started on port 3000');
});

app.use(express.static(path.join(__dirname, '/public')));
