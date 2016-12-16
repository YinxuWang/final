"use strict";

export default function (sequelize, DataTypes) {
  let UserReg = sequelize.define('UserReg',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: "seq"},
      reg_name: {type: DataTypes.STRING(45), allowNull: false, field: 'reg_name'},
      reg_ismail: {type: DataTypes.INTEGER, defaultValue: "", field: 'reg_ismail'},
      reg_vcode: {type: DataTypes.STRING(16), defaultValue: "", field: 'reg_vcode'},
      reg_time: {type: DataTypes.DATE, field: 'reg_time', allowNull: false},
      reg_pw: {type: DataTypes.STRING(45), field: 'reg_pw'},
    },
    {
      tableName: 'userinfo',
      classMethods: {
        associate: function (db) {
        }
      },
      getterMethods: {
        profile(){
          return {
            reg_type: this.reg_ismail,
            reg_value: this.reg_name,
            reg_chk_num: this.reg_vcode,
            reg_time: this.reg_time
          }
        }
      }
    });

  return UserReg;
}
