"use strict";

var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false});
var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        get: function() {
          return '/wiki/' + this.getDataValue('urlTitle');
        }
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: null
    }
},
// Hooks
  {
      hooks: {
          beforeValidate: function (page, options){
              page.urlTitle = generateUrlTitle(page.title);
           }
       }
  }

);

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      },
      allowNull: false
    }
});


Page.belongsTo(User, {as: 'author'});




function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

module.exports = {
  Page: Page,
  User: User
};
