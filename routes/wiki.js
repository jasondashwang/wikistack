var express = require('express');
var models = require('../models');
var Promise = require('bluebird');
var router = express.Router();
var User = models.User;
var Page = models.Page;


router.get('/', function(req, res, next) {
  models.Page.findAll({}).then(function(jsonArr) {
    var pages = jsonArr.map(function(json) {
      return json.dataValues;
    });
    res.render('index', {pages: pages});
  });
});

router.post('/', function(req, res, next) {
  var jsonInput = req.body;

  models.User
    .findOrCreate({where: {name: jsonInput.author_name, email: jsonInput.author_email}})
    .then(function(values){
      var user = values[0];
      var page = models.Page.build({
        title: jsonInput.title,
        content: jsonInput.content,
        status: jsonInput.status,
        tags: jsonInput.tags.split(' ')
      });

      return page.save().then(function (pageJson){
        return page.setAuthor(user);
      });

    }).then(function (page){
      console.log(page.urlTitle);
      res.redirect(page.urlTitle);
    }).catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/users', function(req, res, next){
  models.User.findAll({}).then(function(jsonArr) {
    var users = jsonArr.map(function(json) {
      return json.dataValues;
    });
    res.render('users', {users: users});
  });
});

router.get('/users/:userId', function(req, res, next) {
  var userPromise = models.User.findById(req.params.userId);
  var pagesPromise = models.Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  Promise.all([
    userPromise,
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];
    res.render('userpage', {user: user, pages: pages});
  })
  .catch(next);

});

router.get('/search', function(req, res, next) {
  var tagArr = req.query['tags'].split(' ');
  Page.findAll({
    where: {
      tags: {
        $overlap: tagArr
      }
    }
  }).then(function(arr) {
    res.render('search', {title: 'Search results for ' + req.query['tags'], pages: arr});
  });
});

router.get('/users/:username', function(req, res, next){

});

router.post('/users', function(req, res, next){

});

router.put('/users/:username', function(req, res, next){

});

router.delete('/users/:username', function(req, res, next){

});


router.get('/:pageurl', function(req, res, next) {
  Page.findOne({
      where: {
          urlTitle: req.params.pageurl
      },
      include: [
          {model: User, as: 'author'}
      ]
  })
  .then(function (page) {
      // page instance will have a .author property
      // as a filled in user object ({ name, email })
      if (page === null) {
          res.status(404).send();
      } else {
          console.log(page)
          res.render('wikipage', {
              page: page
          });
      }
  })
  .catch(next);

  // var pageUrl = req.params.pageurl;
  // models.Page.findOne({
  //   where: {urlTitle: pageUrl},
  //   include: [{model: models.User, as: 'author'}]
  // }).then(function (page) {
  //   res.render('wikipage', {page: page});
  // }).catch(next);

});


router.get('/tags/:tag', function(req, res, next){
  var tag = req.params.tag;

  Page.findAll({
    where: {
      tags: {
        $overlap: [tag]
      }
    }
  }).then(function(arr) {
    res.render('search', {title: tag, pages: arr});
  });
});

module.exports = router;


