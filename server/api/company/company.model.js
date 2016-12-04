import db from '../../sqldb';

"use strict";

export default function (sequelize, DataTypes) {
  var Company = sequelize.define('Company',
    {
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {type: DataTypes.STRING(48), field: "company_name"},
      license: {type: DataTypes.BLOB('long'), field: "company_license"},
      licenseNumber: {type: DataTypes.STRING(20), filed: "company_license_num"},
      legalPerson: {type: DataTypes.STRING(45), filed: "company_legal_person"},
      phone: {type: DataTypes.STRING(45), filed: "company_phone"},
      mail: {type: DataTypes.STRING(45), filed: "company_mail"},
      address: {type: DataTypes.STRING(45), filed: "company_address"},
      profile: {type: DataTypes.STRING(45), filed: "company_profile"},
      contact: {type: DataTypes.STRING(45), filed: "company_contact"},
      contactPhone: {type: DataTypes.STRING(45), filed: "company_contact_phone"},
      lockId: {type: DataTypes.STRING(45), filed: "company_lock_id"},
      nickname: {type: DataTypes.STRING(45), filed: "company_nick_name"},
      status: {type: DataTypes.INTEGER(4), field: "company_status"},
      reviewResult: {type: DataTypes.STRING(200), field: "company_review_result"},
    },
    {
      tableName: 'companyinfo',
      classMethods: {
        associate(db){
          Company.belongsTo(db.User, {as: 'company_reviewer'})
        }
      },
      getterMethods: {},
      instanceMethods: {},
      hooks: {}
    });
  return Company;
}

