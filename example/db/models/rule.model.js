import Sequelize, { Model } from 'sequelize';

export const fields = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  minAge: {
    type: Sequelize.SMALLINT,
    defaultValue: 0,
    validate: { min: 0, max: 150 },
  },
  maxAge: {
    type: Sequelize.SMALLINT,
    defaultValue: 150,
    validate: { min: 0, max: 150 },
  },
};

export default (sequelize) => {
  class Rule extends Model {}
  Rule.init(
    fields,
    {
      tableName: 'Rule',
      sequelize,
      timestamps: false,
      paranoid: true,
      name: {
        singular: 'rule',
        plural: 'rules',
      },
    },
  );
  return Rule;
};
