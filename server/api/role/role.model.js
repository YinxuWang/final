"use strict";

export default function (sequelize, DataTypes) {
  let Role = sequelize.define('Role',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
      id: {type: DataTypes.INTEGER, field: "role_id", allowNull: false},
      name: {type: DataTypes.STRING(20), field: "role_name", allowNull: false},
      desc: {type: DataTypes.STRING(200), field: "role_desc", defaultValue: ''}
    },
    {
      tableName: 'roleinfo',
      getterMethods: {},
      instanceMethods: {},
      hooks: {}
    });
  return Role;
}
