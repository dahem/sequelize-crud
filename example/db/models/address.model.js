import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Address extends Model {
    static associate() {
      this.belongsTo(sequelize.models.Patient, {
        foreignKey: 'patientId',
      });
    }
  }
  Address.init(
    {
      street: {
        type: Sequelize.STRING,
      },
      number: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'Address',
      sequelize,
      timestamps: true,
      paranoid: true,
      paginationRequired: true,
      name: {
        singular: 'address',
        plural: 'addresses',
      },
    },
  );
  return Address;
};
