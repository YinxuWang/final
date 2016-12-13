"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';

export default function (sequelize, DataTypes) {
  var btLockPw = sequelize.define('btLockPw',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "btlockPw_seq"},
      //lockpw_lock_seq: {type: DataTypes.CHAR(45), allowNull: false, field: 'btlockpw_lock_seq'},
      lockpw_username: {type: DataTypes.CHAR(45), defaultValue: "", field: 'btlockpw_lock_username'},
      lockpw_userphone: {type: DataTypes.BLOB('tiny'), defaultValue: "", field: 'btlockpw_userphone'},
      lockpw_type: {type: DataTypes.CHAR(45), field: 'btlockpw_type', allowNull: false},
      lockpw_value: {type: DataTypes.CHAR(45), field: 'btlockpw_value'},
      //foreign key lock_company: {type: DataTypes.BIGINT(20), field: 'room_lock_seq', defaultValue: 2},
      //foreign key lock_room: {type: DataTypes.BIGINT(20), defaultValue: 0, field: 'room_group_seq'},
      lockpw_starttime: {type: DataTypes.CHAR(45), allowNull: true, field: 'btlockpw_starttime'},
      lockpw_content: {type: DataTypes.CHAR(45), field: 'btlockpw_content', allowNull: true},
      lockpw_sender_seq: {type: DataTypes.DATE, field: 'btlockpw_send_seq', allowNull: true},
      lockpw_send_time: {type: DataTypes.CHAR(45), field: 'btlockpw_send_time', allowNull: true},
      lockpw_sender_name: {type: DataTypes.CHAR(45), field: 'btlockpw_sender_name', allowNull: true},

    },
    {
      tableName: 'btlockPw',
      classMethods: {
        associate: function (db) {
          // use foreignKey, ... is db User's primary key
          btLock.belongsTo(db.Lock, {foreignKey: 'lockpw_lock_seq', constraints: false});
        }
      },
      getterMethods: {
        profile(){
          let bind_or_not = 0;
          if (this.lock_room)
            bind_or_not = 1;
          return {
            bindOrNot : bind_or_not,
            lock_name : this.lock_id,
            lock_model : "蓝牙门锁",
            lock_manager : this.lock_manager
          }
        },
      },
      hooks: {},
      instanceMethods: {}
    });

  return Lock;
}
