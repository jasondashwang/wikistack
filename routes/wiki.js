var express = require('express');
var models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/');
  res.end();
});

router.post('/', function(req, res, next) {
  var jsonInput = req.body;

  var page = models.Page.build({
    title: jsonInput.title,
    content: jsonInput.content,
    status: jsonInput.status
  });

  var pagePromise = page.save();

  var user = models.User.build({
    name: jsonInput.author_name,
    email: jsonInput.author_email
  })

  var userPromise = user.save();




  Promise.all([pagePromise, userPromise])
      .then(function(){
        res.redirect('/wiki/');
      })
      .catch(function(error){
        console.log(error);
      });

});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/users', function(req, res, next){

});

router.get('/users/:username', function(req, res, next){

});

router.post('/users', function(req, res, next){

});

router.put('/users/:username', function(req, res, next){

});

router.delete('/users/:username', function(req, res, next){

});


module.exports = router;


