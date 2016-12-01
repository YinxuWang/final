"use strict";

import crypto from 'crypto';

export default function (sequelize, DataTypes) {
  var User = sequelize.define('User',
    {
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.CHAR(12),
        allowNull: false,
        field: 'user_id'
      },
      userPhone: {
        type: DataTypes.CHAR(11),
        field: 'user_phone'
      },
      userMail: {
        type: DataTypes.STRING(45),
        field: 'user_mail'
      },
      userPw: {
        type: DataTypes.STRING(16),
        field: 'user_pw',
        allowNull: false
      },
      userName: {
        type: DataTypes.STRING(45),
        field: 'user_name'
      },
      userStatus: {
        type: DataTypes.BOOLEAN,
        field: 'user_status'
      },
      userRole: {
        type: DataTypes.INTEGER(6),
        field: 'user_role'
      },
      userLogCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'user_log_count'
      },
      userLogTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'user_log_time'
      },
      userLogWhere: {
        type: DataTypes.INTEGER(4),
        field: 'user_log_where'
      },
      userIdCard: {
        type: DataTypes.STRING(16),
        field: 'user_id_card'
      }
    },
    {
      tableName: 'userinfo',
      getterMethods: {
        profile(){
          return {
            name: this.userName,
            role: this.userRole
          }
        },
        token(){
          return {
            seq: this.seq,
            role: this.userRole
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
              user.generateUserId(err=> {
                if (err) {
                  return fn(err);
                }
                totalUpdated += 1;
                if (totalUpdated === users.length) {
                  return fn();
                }
              });
            });
          })
        }
      },
      instanceMethods: {
        authenticate(password, callback){
          if (!callback) {
            // TODO add hooks to encrypt password
            return this.userPw === password;
          }
          var _this = this;
          this.encryptPassword(password, function (err, pwdGen) {
            if (err) {
              callback(err);
            }

            if (_this.userPw === pwdGen) {
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
          this.encryptPassword(this.userPw, (encryptErr, hashedPassword) => {
            if (encryptErr) {
              fn(encryptErr);
            }
            this.userPw = hashedPassword;
            fn(null);
          });
        },
        generateUserId(fn){
          var _this = this;
          User.findOne({
            where: {
              userId: {
                $like: "1%"
              }
            }
          }).then(user=> {
            if (!user) {
              // console.log(this);
              _this.userId = '100001';
              console.log(_this);
              fn(null);
            } else {
              console.log(_this);
              _this.userId = '';
              // console.log(user);
            }
          });
        }
      }
    });

  return User;
}
