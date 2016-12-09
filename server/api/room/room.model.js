"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';

export default function (sequelize, DataTypes) {
  var Room = sequelize.define('Room',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "seq"},
      room_name: {type: DataTypes.CHAR(45), allowNull: false, field: 'room_name'},
      room_address: {type: DataTypes.CHAR(400), defaultValue: "", field: 'room_address'},
      room_model: {type: DataTypes.CHAR(20), defaultValue: "", field: 'room_model'},
      room_area: {type: DataTypes.INTEGER, field: 'room_area', allowNull: false},
      room_floor: {type: DataTypes.INTEGER, field: 'room_floor'},
      room_lock_seq: {type: DataTypes.BIGINT(20), field: 'room_lock_seq', defaultValue: 2},
      room_group_seq: {type: DataTypes.BIGINT(20), defaultValue: 0, field: 'room_group_seq'},
      room_cs_seq: {type: DataTypes.BIGINT(20), defaultValue: DataTypes.NOW, field: 'room_cs_seq'},
      room_company_seq: {type: DataTypes.BIGINT(20), field: 'room_company_seq', defaultValue: 1},

    },
    {
      tableName: 'roominfo',
      classMethods: {
        associate: function (db) {
          // use foreignKey, room_mgnr_seq is db User's primary key
          Room.belongsTo(db.User, {foreignKey: 'room_mgnr_seq', constraints: false});
          //User.belongsTo(db.Role, {foreignKey: 'role', targetKey: 'id', constraints: false})
        }
      },
      getterMethods: {
        profile(){
          return {
            room_name : this.room_name,
            room_address : this.room_address,
            room_model : this.room_model,
            room_lock_seq : this.room_lock_seq
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

  return Room;
}
