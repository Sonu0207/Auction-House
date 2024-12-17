import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const getSellerItems = (sellerId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM itemTable WHERE sellerUsername = ?", 
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
    const result = await getSellerItems(event.username);
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
