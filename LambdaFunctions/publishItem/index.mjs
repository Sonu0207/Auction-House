import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const publishItem = (sellerId, itemId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COALESCE(publishDate, '0000-00-00 00:00:00') AS publishDate, COALESCE(endDate, '0000-00-00 00:00:00') AS endDate, active FROM itemTable WHERE sellerUsername = ? AND itemId = ?", 
        [sellerId, itemId], 
        (error, rows) => {
          if (error) return reject(error);
          if(rows[0].endDate < NOW()){
            resolve(false)
          }
          else if (rows && rows.length > 0 && (rows[0].publishDate === '0000-00-00 00:00:00' || !rows[0].active)) {
            pool.query(
              "UPDATE itemTable SET publishDate = NOW(), active=true WHERE sellerUsername = ? AND itemId = ?", 
              [sellerId, itemId], 
              (error, result) => {
                if (error) return reject(error);
                resolve(result.affectedRows > 0);
              }
            );
          } else {
            resolve(false);
          }
        }
      );
    });
  };

  try {
    const result = await publishItem(event.username, event.itemId);
    response = {
      statusCode: result ? 200 : 400,
      body: result ? { response: "item published successfully" } : { response: "item was not published" }
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
