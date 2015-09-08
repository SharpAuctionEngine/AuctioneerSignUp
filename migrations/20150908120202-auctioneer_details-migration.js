'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:*/
      return queryInterface.createTable('auctioneersignup', { 
          id: {
               type:DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
              },

          createdAt: {
                     type: DataTypes.DATE
                     },
          updatedAt: {
                     type: DataTypes.DATE
                     },

          username: {
                    type:DataTypes.STRING,
                    defaultValue: false,
                    // allowNull: false
                    },
          email: {
                 type:DataTypes.STRING,
                 defaultValue: false,
                 // allowNull: false
                 },
          auction_house_name:{ 
                             type:DataTypes.STRING,
                             defaultValue: false,
                             // allowNull: false
                             },
          jsonblob :
                    {
                      type:DataTypes.JSON,
                      defaultValue: false,
                      allowNull: false
                    },
          result :
                    {
                      type:DataTypes.JSON,
                      defaultValue: false,
                      allowNull: false
                    }
        });
    
  },

  down: function (queryInterface, DataTypes) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:*/
       return queryInterface.dropTable('auctioneersignup');
    
  }
};
