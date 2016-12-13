"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';

export default function (sequelize, DataTypes) {
  var Room = sequelize.define('Room',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "seq"},
      room_name: {type: DataTypes.CHAR(45), allowNull: false, field: 'room_name'},
      room_address: {type: DataTypes.CHAR(255), defaultValue: "", field: 'room_address'}, // max is 255, 400 needed, blob needed
      room_model: {type: DataTypes.CHAR(20), defaultValue: "", field: 'room_model'},
      room_area: {type: DataTypes.INTEGER, defaultValue: 0, field: 'room_area'},
      room_floor: {type: DataTypes.INTEGER, defaultValue: 1, field: 'room_floor'},
      room_lock_seq: {type: DataTypes.BIGINT(20), field: 'room_lock_seq', defaultValue: 0},
      room_group_seq: {type: DataTypes.BIGINT(20), defaultValue: 0, field: 'room_group_seq'},
      room_cs_seq: {type: DataTypes.BIGINT(20), defaultValue: DataTypes.NOW, field: 'room_cs_seq'},
      //foreign key: room_company_seq: {type: DataTypes.BIGINT(20), field: 'room_company_seq', defaultValue: 1},

    },
    {
      tableName: 'roominfo',
      classMethods: {
        associate: function (db) {
          // use foreignKey, room_mgnr_seq is db User's primary key
          Room.belongsTo(db.Company, {foreignKey: 'room_company_seq', constraints: false});
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

  return Room;
}
