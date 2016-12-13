"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';


/* Brief:
* database for bluetooth lock
* entry added only when mobile app request binding a lock to a room, for now.
*/
export default function (sequelize, DataTypes) {
  let btLock = sequelize.define('btLock',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "btlock_seq"},
      lock_id: {type: DataTypes.CHAR(12), allowNull: false, field: 'btlock_id'},
      lock_btname: {type: DataTypes.CHAR(45), defaultValue: "", field: 'btlock_btname'},
      lock_mngpw: {type: DataTypes.BLOB('tiny'), field: 'btlock_manager_password'},
      lock_key: {type: DataTypes.BLOB('tiny'), field: 'btlock_key', allowNull: true},
      lock_counter: {type: DataTypes.INTEGER, defaultValue: 0, field: 'btlock_counter'},
      //foreign key lock_company: {type: DataTypes.BIGINT(20), field: 'room_lock_seq', defaultValue: 2},
      //foreign key lock_room: {type: DataTypes.BIGINT(20), defaultValue: 0, field: 'room_group_seq'},
      //foreign key lock_manager: {type: DataTypes.BIGINT(20), allowNull: true, field: 'btlock_manager'},
      lock_btmac: {type: DataTypes.CHAR(45), field: 'btlock_btmac', allowNull: true},
      lock_bindtime: {type: DataTypes.DATE, field: 'btlock_bindtime', allowNull: true},
    },
    {
      tableName: 'btlockinfo',
      classMethods: {
        associate: function (db) {
          // use foreignKey, ... is db User's primary key
          btLock.belongsTo(db.Company, {foreignKey: 'lock_company', constraints: false});
          btLock.belongsTo(db.Room, {foreignKey: 'lock_room', constraints: false});
          btLock.belongsTo(db.User, {foreignKey: 'lock_manager', constraints: false})
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

  return btLock;
}
