import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const getRemoveEligibleItemIds = (sellerId, authKey) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT username FROM sellerTable WHERE username=? and authKey=?", [sellerId, authKey], (error, rows) => {
          if (error) { return reject(error) }
              if ((rows) && (rows.length != 0)) {
                pool.query("SELECT itemId FROM itemTable WHERE sellerUsername = ? AND active = 0 AND archive = 0 AND frozen = 0 AND buyerUsername is null", [sellerId], (error, rows) => {
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
        })
    });
  };

  try {
    const result = await getRemoveEligibleItemIds(event.username, event.authKey);
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
