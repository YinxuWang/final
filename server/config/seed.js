/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
const ROLE = require('./environment/shared').ROLE;
var User = sqldb.User;


User.sync()
  .then(() => User.destroy({where: {}}))
  .then(() => {
    User.bulkCreate([{
      role: ROLE.SUPER_ADMIN,
      name: 'sadmin',
      phone: '13312341234',
      password: 'test1',
      id: "100001"
    }, {
      role: ROLE.ADMIN,
      name: 'admin',
      phone: '13312341235',
      password: 'test2',
      id: "100002"
    }, {
      role: ROLE.MANAGER,
      name: 'manager',
      mail: 'test@luoke.com',
      password: 'test3',
      id: "m00001"
    }])
      .then(() => {
        console.log('finished populating users');
      });
  });
