import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const searchRecentlySoldBuyer = (buyerUsername, authKey, searchTerm) => {
    console.log(event);
    return new Promise((resolve, reject) => {
      pool.query("SELECT username FROM buyerTable WHERE username=? and authKey=?", [buyerUsername, authKey], (error, rows) => {
          if (error) { return reject(error) }
              if ((rows) && (rows.length != 0)) {
                pool.query("SELECT * FROM itemTable WHERE fulfilledDate > convert_tz(DATE_SUB(NOW(), INTERVAL 24 HOUR),'utc', 'est') AND itemName LIKE %?%", [searchTerm], (error, rows) => {
                    if (error) { return reject(error) }
                    if ((rows) && (rows.length != 0)) {
                      return resolve(rows)
                    } else {
                        return resolve(false)
                    }
                });
              } else {
                  return resolve(false)
              }
        }
      );
    });
  };

  try {
    const result = await searchRecentlySoldBuyer(event.buyerUsername, event.authKey, event.searchTerm);
    response = {
      statusCode: result ? 200 : 400,
      body: result ? { response: "items searched successfully" } : { response: "items not searched" }
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
