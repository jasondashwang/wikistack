
var express = require('express');
var swig = require('swig');
var router = require('./routes/wiki');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var models = require('./models');

var logger = morgan('dev');
var app = new express();


app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests


app.engine('html', swig.renderFile); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
app.set('views', path.join(__dirname, '/views')); // where to find the views
swig.setDefaults({ cache: false });

app.use(logger);
app.use('/wiki', router);

var userModelPromise = models.User.sync({});
var pageModelPromise = models.Page.sync({});
Promise.all([userModelPromise, pageModelPromise]).then(function () {
          return models.Page.sync({});
      })
      .then(function () {
          app.listen(3000, function(){
            console.log('Server started on port 3000');
          });
      })
      .catch(console.error);

app.use(express.static(path.join(__dirname, '/public')));
