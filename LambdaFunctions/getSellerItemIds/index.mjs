import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const getSellerItemIds = (sellerId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT itemId FROM itemTable WHERE sellerUsername = ?", 
        [sellerId], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return resolve(false)
            }
        });
    });
  };

  try {
    const result = await getSellerItemIds(event.username);
    response = {
      statusCode: result ? 200 : 400,
      body: result ? { response: result } : { response: "items were not retrieved" }
    };
  } catch (error) {
    response = {
      statusCode: 500,
      body: { error: error.message }
    };
  }

  pool.end();
  return response;
};
