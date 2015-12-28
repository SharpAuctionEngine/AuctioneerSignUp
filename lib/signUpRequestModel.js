var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');

var defineUser = function(db)
{
    var User = db.define('auctioneersignup', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },

      username: {
        type: Sequelize.STRING,
        defaultValue: false,
        // allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: false,
        // allowNull: false
      },
      auction_house_name: {
        type: Sequelize.STRING,
        defaultValue: false,
        // allowNull: false
      },
      auction_house_name_url: {
        type: Sequelize.STRING,
        defaultValue: false,
        // allowNull: false
      },
      jsonblob: {
        type: Sequelize.JSON,
        defaultValue: false,
        allowNull: false
      },
      results: {
        type: Sequelize.JSON,
        defaultValue: false,
        allowNull: false
      },
      stripejson: {
        type: Sequelize.JSON,
        defaultValue: false,
        allowNull: false
      }
    });

    return User;
};

module.exports = defineUser;
