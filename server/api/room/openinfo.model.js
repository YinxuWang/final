"use strict";

import crypto from 'crypto';
import * as utils from '../../components/utils';

export default function (sequelize, DataTypes) {
  let OpenInfo = sequelize.define('OpenInfo',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "seq"},
      open_time: {type: DataTypes.DATE, field: 'open_time'},
      open_type: {type: DataTypes.INTEGER, defaultValue: 0, field: 'open_type'},

    },
    {
      tableName: 'openinfo',
      classMethods: {
        associate: function (db) {
          OpenInfo.belongsTo(db.Room, {foreignKey: 'open_room_seq', constraints: false});
          OpenInfo.belongsTo(db.User, {foreignKey: 'open_user_seq', constraints: false});
        }
      },
      getterMethods: {
      },
      hooks: {},
      instanceMethods: {}
    });

  return OpenInfo;
}
