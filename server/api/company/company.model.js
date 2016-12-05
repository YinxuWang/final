"use strict";

export default function (sequelize, DataTypes) {
  var Company = sequelize.define('Company',
    {
      seq: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
      name: {type: DataTypes.STRING(48), field: "company_name"},
      license: {type: DataTypes.BLOB('long'), field: "company_license"},
      licenseNumber: {type: DataTypes.STRING(20), field: "company_license_num"},
      legalPerson: {type: DataTypes.STRING(45), field: "company_legal_person"},
      phone: {type: DataTypes.STRING(45), field: "company_phone"},
      mail: {type: DataTypes.STRING(45), field: "company_mail"},
      address: {type: DataTypes.STRING(45), field: "company_address"},
      profile: {type: DataTypes.STRING(45), field: "company_profile"},
      contact: {type: DataTypes.STRING(45), field: "company_contact"},
      contactPhone: {type: DataTypes.STRING(45), field: "company_contact_phone"},
      lockId: {type: DataTypes.STRING(45), field: "company_lock_id"},
      nickname: {type: DataTypes.STRING(45), field: "company_nick_name"},
      status: {type: DataTypes.INTEGER(4), field: "company_status"},
      reviewResult: {type: DataTypes.STRING(200), field: "company_review_result"},
    },
    {
      tableName: 'companyinfo',
      classMethods: {
        associate: function (db) {
          Company.belongsTo(db.User, {foreignKey: 'manager', targetKey: 'id', constraints: false});
          Company.belongsTo(db.User, {foreignKey: 'reviewer', targetKey: 'id', constraints: false});
        }
      },
      getterMethods: {},
      instanceMethods: {},
      hooks: {},
      timestamps: true,
      underscored: true
    });
  return Company;
}

