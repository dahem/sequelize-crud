
export const createTable = (tableName, defineTable) => (
  (queryInterface, Sequelize) => queryInterface.createTable(tableName, defineTable(Sequelize))
);

export const dropTable = tableName => queryInterface => queryInterface.dropTable(tableName);

export const createAndDropTable = (tableName, defineTable) => ({
  up: createTable(tableName, defineTable),
  down: dropTable(tableName),
});

export const insertAndDeleteTableItems = (tableName, data, model = null) => {
  if (Array.isArray(data) && model === null) {
    return {
      up: queryInterface => queryInterface.bulkInsert(tableName, data),
      down: queryInterface => queryInterface.bulkDelete(tableName),
    };
  }

  if (Array.isArray(data) && model !== null) {
    return {
      up: () => Promise.all(data.map(x => model.create(x))),
      down: queryInterface => queryInterface.bulkDelete(tableName),
    };
  }

  if (!Array.isArray(data)) {
    return {
      up: queryInterface => data().then(res => queryInterface.bulkInsert(tableName, res)),
      down: queryInterface => queryInterface.bulkDelete(tableName),
    };
  }

  return {};
};

export const timestampsColumns = Sequelize => ({
  createdAt: { type: Sequelize.DATE },
  updatedAt: { type: Sequelize.DATE },
  deletedAt: { type: Sequelize.DATE },
});

export const defaultColumns = Sequelize => ({
  externalId: { type: Sequelize.INTEGER },
  isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  ...timestampsColumns(Sequelize),
});

export const isActiveAndExternalField = Sequelize => ({
  externalId: { type: Sequelize.INTEGER, unique: true },
  isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
});
