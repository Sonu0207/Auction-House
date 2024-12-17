import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const reviewActiveBids = (sellerUsername, authKey) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT username FROM buyerTable WHERE username=? and authKey=?", [sellerUsername, authKey], (error, rows) => {
          if (error) { return reject(error) }
              if ((rows) && (rows.length != 0)) {
                pool.query("SELECT itemId FROM itemTable WHERE sellerUsername=? and fullfilled=0 and frozen=0 and endDate < NOW() and buyerUsername IS NOT NULL", [sellerUsername], (error, rows) => {
                    if (error) { return reject(error) }
                    if ((rows) && (rows.length != 0)) {
                      return resolve(rows)
                    } else {
                        return resolve([])
                    }
                });
              } else {
                  return resolve(false)
              }
        }
      );
    });
  };

  let result = await reviewActiveBids(event.sellerUsername, event.authKey)

  if(result){
    response = {
      statusCode: 200,
      body: {"response": result}
    }
  }
  else{ 
    response = { 
      statusCode: 400, 
      body: {"response" : result}
    }
  }
  pool.end(); 
  return response; 
}