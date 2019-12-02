import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Patient extends Model {
    static associate() {
      this.hasMany(sequelize.models.Address, {
        foreignKey: 'patientId',
      });
    }
  }
  Patient.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      identityCard: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'Patient',
      sequelize,
      timestamps: true,
      paranoid: true,
      paginationRequired: true,
      name: {
        singular: 'patient',
        plural: 'patients',
      },
    },
  );
  return Patient;
};
