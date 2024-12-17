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
        pool.query("SELECT itemId FROM itemTable WHERE sellerUsername = ? and active=0 and frozen=0 and fullfilled = 0 and itemName IS NOT NULL and description IS NOT NULL and price IS NOT NULL and image IS NOT NULL and endDate > '0000-00-00 00:00:00'", 
        [sellerId], (error, rows) => {
          console.log(rows)
            if (error) { return reject(error) }
            if ((rows)) {
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