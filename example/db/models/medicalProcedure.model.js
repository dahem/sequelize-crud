import Sequelize, { Model } from 'sequelize';

export const fields = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shortName: {
    type: Sequelize.STRING,
  },
};

export default (sequelize) => {
  class MedicalProcedure extends Model {
    static associate() {
      this.belongsTo(sequelize.models.Rule, {
        foreignKey: { name: 'ruleId', allowNull: true },
      });
    }
  }

  MedicalProcedure.init(
    fields,
    {
      tableName: 'MedicalProcedure',
      sequelize,
      timestamps: true,
      paranoid: true,
      paginationRequired: true,
      searchFields: ['code', ['name', 'like']],
      name: {
        singular: 'medicalProcedure',
        plural: 'medicalProcedures',
      },
    },
  );

  return MedicalProcedure;
};
