"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';

export default function (sequelize, DataTypes) {
  var UserRoom = sequelize.define('Room',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "seq"},
      //ur_room_seq: {type: DataTypes.INTEGER, allowNull: false, field: 'room_name'},

      //ur_lock_company: {type: DataTypes.CHAR(20), defaultValue: "", field: 'room_model'},
      ur_user_type: {type: DataTypes.INTEGER, field: 'ur_room_usertype', allowNull: false},
      ur_user_status: {type: DataTypes.INTEGER, field: 'ur_room_userstatus'},
      ur_createtime: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ur_room_createtime'},
      ur_key_type: {type: DataTypes.INTEGER, defaultValue: 1, field: 'ur_room_key_type'},
      ur_key_starttime: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ur_room_key_starttime'},
      ur_key_endtime: {type: DataTypes.DATE, field: 'ur_room_key_endtime'},
      ur_key_sender_seq: {type: DataTypes.CHAR(20), defaultValue: "", field: 'ur_room_key_senderseq'},
      ur_key_sender_name: {type: DataTypes.CHAR(20), defaultValue: "", field: 'ur_room_key_sendername'},
      ur_key_sendtime: {type: DataTypes.DATE, field: 'ur_room_sendtime'}
    },
    {
      tableName: 'user_room_info',
      classMethods: {
        associate: function (db) {

          UserRoom.belongsTo(db.User, {foreignKey: 'ur_user_seq', constraints: false});
          UserRoom.belongsTo(db.Room, {foreignKey: 'ur_room_seq', constraints: false});
          UserRoom.belongsTo(db.Company, {foreignKey: 'ur_lock_company', constraints: false});
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
      },
      hooks: {},
      instanceMethods: {}
    });

  return UserRoom;
}
