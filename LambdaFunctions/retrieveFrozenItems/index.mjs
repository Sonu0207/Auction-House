import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });

  const getFrozenItemsBySeller = (sellerId) => {
    return new Promise((resolve, reject) => {
      // Fetch frozen items of the seller
      pool.query(
        "SELECT itemId, itemName FROM itemTable WHERE sellerUsername = ? AND frozen = 1",
        [sellerId], (error, rows) => {
          if (error) {
            return reject(error);
          }

          if (rows && rows.length > 0) {
            return resolve(rows); // Return frozen items
          } else {
            return resolve([]); // No frozen items
          }
        }
      );
    });
  };

  try {
    const result = await getFrozenItemsBySeller(event.username);
    response = {
      statusCode: result.length > 0 ? 200 : 400,
      body: result.length > 0
        ? { response: result }
        : { response: "No frozen items found" },
    };
  } catch (error) {
    response = {
      statusCode: 500,
      body: { error: error.message },
    };
  }

  pool.end();
  return response;
};