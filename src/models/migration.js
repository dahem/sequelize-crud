
export const transaction = (fn, conn) => sequelize.transaction(fn);
// prettier-ignore
export const createTable = (tableName, defineTable) => (
  (queryInterface, Sequelize) => (
    transaction(() => queryInterface.createTable(tableName, defineTable(Sequelize)), conn)
  )
);
// prettier-ignore
export const dropTable = (tableName, conn) => (
  queryInterface => (
    transaction(() => queryInterface.dropTable(tableName), conn)
  )
);

export const createAndDropTable = (tableName, defineTable, conn) => ({
  up: createTable(tableName, defineTable, conn),
  down: dropTable(tableName, conn),
});

export const insertAndDeleteTable = (tableName, data, model = null, conn) => {
  if (Array.isArray(data) && model === null) {
    return {
      up: queryInterface => transaction(() => queryInterface.bulkInsert(tableName, data), conn),
      down: queryInterface => queryInterface.bulkDelete(tableName),
    };
  }

  if (Array.isArray(data) && model !== null) {
    return {
      up: () => transaction(() => data.map(x => model.create(x)), conn),
      down: queryInterface => queryInterface.bulkDelete(tableName),
    };
  }

  if (!Array.isArray(data)) {
    return {
      up: queryInterface => transaction(async () => {
        const resultData = await data();
        return queryInterface.bulkInsert(tableName, resultData);
      }, conn),
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
  externalId: { type: Sequelize.INTEGER, unique: true },
  active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  ...timestampsColumns(Sequelize),
});
