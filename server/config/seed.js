/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
const ROLE = require('./environment/shared').ROLE;
const AUDIT_STATUS = require('./environment/shared').AUDIT_STATUS;
const User = sqldb.User;
const Role = sqldb.Role;
const Company = sqldb.Company;

Company.sync({force: true})
  .then(()=> {
    Company.bulkCreate([{
      name: "北京洛克智能有限公司",
      nickname: "洛克智能",
      status: AUDIT_STATUS.PASS,
      manager: "100001",
    }, {
      name: "阿里巴巴网络技术有限公司",
      nickname: "阿里",
      status: AUDIT_STATUS.PENDING,
      manager: "m00001",
    }, {
      name: "深圳市腾讯计算机系统有限公司",
      nickname: "腾讯",
      status: AUDIT_STATUS.REJECT,
      manager: "m00002"
    }, {
      name: "北京小米科技有限责任公司",
      nickname: "小米",
      status: AUDIT_STATUS.PASS,
      manager: "m00003"
    }]);
  })
  .then(() => {
    console.log('finished populating company');
  });

User.sync({force: true})
  .then(() => {
    User.bulkCreate([{
      role: ROLE.SUPER_ADMIN,
      name: 'sadmin',
      phone: '13312341234',
      password: 'test1',
      id: "100001",
      company: 1
    }, {
      role: ROLE.ADMIN,
      name: 'admin',
      phone: '13312341235',
      password: 'test2',
      id: "100002",
      company: 1
    }, {
      role: ROLE.MANAGER,
      name: '马云',
      mail: 'test@taobao.com',
      password: 'test3',
      id: "m00001",
      company: 2
    }, {
      role: ROLE.MANAGER,
      name: '马化腾',
      mail: 'test@qq.com',
      password: 'test3',
      id: "m00002",
      company: 3
    }, {
      role: ROLE.MANAGER,
      name: '雷军',
      mail: 'test@xiaomi.com',
      password: 'test3',
      id: "m00003",
      company: 4
    }])
      .then(() => {
        console.log('finished populating users');
      });
  });

Role.sync({force: true})
  .then(()=> {
    Role.bulkCreate([
      {id: 1, name: '超级管理员'},
      {id: 2, name: '运行管理员'},
      {id: 3, name: '总经理'},
      {id: 4, name: '一级部门负责人'},
      {id: 5, name: '二级部门负责人'},
      {id: 6, name: '三级部门负责人'}
    ]);
  })
  .then(()=> {
    console.log('finished populating role');
  });
