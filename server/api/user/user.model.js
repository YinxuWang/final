"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';

export default function (sequelize, DataTypes) {
  var User = sequelize.define('User',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "seq"},
      id: {type: DataTypes.CHAR(12), allowNull: false, field: 'user_id'},
      phone: {type: DataTypes.CHAR(11), defaultValue: "", field: 'user_phone'},
      mail: {type: DataTypes.STRING(45), defaultValue: "", field: 'user_mail'},
      password: {type: DataTypes.STRING(32), field: 'user_pw', allowNull: false},
      name: {type: DataTypes.STRING(45), field: 'user_name'},
      status: {type: DataTypes.INTEGER(3), field: 'user_status', defaultValue: 2},
      logCount: {type: DataTypes.INTEGER, defaultValue: 0, field: 'user_log_count'},
      logTime: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'user_log_time'},
      LogWhere: {type: DataTypes.INTEGER(4), field: 'user_log_where', defaultValue: 1},
      idCard: {type: DataTypes.STRING(16), field: 'user_id_card', defaultVale: ""}
    },
    {
      tableName: 'userinfo',
      classMethods: {
        associate: function (db) {
          User.belongsTo(db.Company, {foreignKey: 'company', constraints: false});
          User.belongsTo(db.Role, {foreignKey: 'role', targetKey: 'id', constraints: false})
        }
      },
      getterMethods: {
        profile(){
          return {
            name: this.name,
            role: this.role
          }
        },
        token(){
          return {
            id: this.id,
            role: this.role
          }
        }
      },
      hooks: {
        beforeBulkCreate(users, fields, fn){
          var totalUpdated = 0;
          users.forEach(user=> {
            user.updatePassword(err => {
              if (err) {
                return fn(err);
              }
              totalUpdated += 1;
              if (totalUpdated === users.length) {
                return fn();
              }
            });
          })
        },
        beforeCreate(user, fields, fn){
          user.updatePassword(err=> {
            if (err) {
              return fn(err);
            }
            user.generateId(fn);
          })
        }
      },
      instanceMethods: {
        authenticate(password, callback){
          if (!callback) {
            // TODO add hooks to encrypt password
            return this.password === password;
          }
          var _this = this;
          this.encryptPassword(password, function (err, pwdGen) {
            if (err) {
              callback(err);
            }

            if (_this.password === pwdGen) {
              callback(null, true);
            } else {
              callback(null, false);
            }
          });
        },
        encryptPassword(password, callback) {
          if (!callback) {
            return crypto.createHash('md5').update(password).digest('hex');
          }
          return callback(null, crypto.createHash('md5').update(password).digest('hex'));
        },
        updatePassword(fn){
          this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
            if (encryptErr) {
              fn(encryptErr);
            }
            this.password = hashedPassword;
            fn(null);
          });
        },
        generateId(fn){
          var _this = this;

          if (_this.phone) {
            User.findOne({
              where: {
                id: {
                  $like: "1%"
                }
              },
              limit: 1,
              order: 'id desc'
            })
              .then(user=> {
                _this.id = utils.generateUserId.fn(utils.generateUserId.TYPE.PHONE, user.id);
              });
          } else {
            User.findOne({
              where: {
                id: {
                  $like: "m%"
                }
              },
              limit: 1,
              order: 'id desc'
            })
              .then(user=> {
                _this.id = utils.generateUserId.fn(utils.generateUserId.TYPE.MAIL, user.id);
              })
          }

        }
      }
    });

  return User;
}
