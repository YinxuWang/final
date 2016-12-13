'use strict';

import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {};
var sequelize = new Sequelize(config.sequelize.db, config.sequelize.user, config.sequelize.password, config.sequelize.options);

// Insert models below
db.Company = sequelize.import('../api/company/company.model');
db.User = sequelize.import('../api/user/user.model');
db.Role = sequelize.import('../api/role/role.model');
db.Room = sequelize.import('../api/room/room.model');
db.Lock = sequelize.import('../api/lock/lock.model');
db.UserRoom = sequelize.import('../api/room/user_room.model');

// Associate Tables
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
