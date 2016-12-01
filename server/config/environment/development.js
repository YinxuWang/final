'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    db: 'luokelock_dev',
    user: 'root',
    password: "123456",
    options: {
      define: {
        underscored: true,
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: true

};
