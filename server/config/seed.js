/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
var User = sqldb.User;

/**
 * UserRole
 * 1 ==> Super Admin
 * 2 ==> Admin
 * 3 ==> Manager
 */
User.sync()
  .then(() => User.destroy({where: {}}))
  .then(() => {
    User.bulkCreate([{
      userRole: 1,
      userName: 'sadmin',
      userPhone: '13312341234',
      userPw: 'test1',
      userId: "100001"
    },{
      userRole: 2,
      userName: 'admin',
      userPhone: '13312341235',
      userPw: 'test2',
      userId: "100002"
    },{
      userRole: 3,
      userName: 'manager',
      userPhone: 'test@luoke.com',
      userPw: 'test3',
      userId: "m00001"
    }])
      .then(() => {
        console.log('finished populating users');
      });
  });
