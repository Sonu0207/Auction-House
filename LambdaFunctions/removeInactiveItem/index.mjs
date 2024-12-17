import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const removeInactiveItem = (sellerId, authKey, itemId) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT username FROM sellerTable WHERE username=? and authKey=?", [sellerId, authKey], (error, rows) => {
          if (error) { return reject(error) }
              if ((rows) && (rows.length != 0)) {
                pool.query("SELECT * FROM itemTable WHERE sellerUsername = ? AND itemId = ? AND buyerUsername is null AND frozen = false AND active = false", [sellerId, itemId], (error, rows) => {
                  if (error) return reject(error);
                  else if (rows && rows.length > 0) {
                    pool.query("Delete FROM itemTable WHERE sellerUsername = ? AND itemId = ?", [sellerId, itemId], (error, result) => {
                      if (error) return reject(error);
                      resolve(result.affectedRows > 0);
                    });
                  } else {
                    resolve(false);
                  }
                }); 
              }else{
                resolve(false);
              }
      });
    });
  };

  try {
    const result = await removeInactiveItem(event.username, event.authKey, event.itemId);
    response = {
      statusCode: result ? 200 : 400,
      body: result ? { response: "item removed successfully" } : { response: "item was not removed" }
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
