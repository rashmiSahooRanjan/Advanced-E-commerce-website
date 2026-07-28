import database from "../database/db.js";

const withTransaction = async (callback) => {
  await database.query("BEGIN");

  try {
    const result = await callback(database);

    await database.query("COMMIT");

    return result;
  } catch (error) {
    await database.query("ROLLBACK");

    throw error;
  }
};

export default withTransaction;
