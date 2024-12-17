import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  const retriveRecentSoldBids = (buyerUsername, authKey) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT username FROM buyerTable WHERE username=? and authKey=?", [buyerUsername, authKey], (error, rows) => {
          if (error) { return reject(error) }
              if ((rows) && (rows.length != 0)) {
                pool.query("SELECT * FROM itemTable WHERE fulfilledDate >= convert_tz(DATE_SUB(NOW(), INTERVAL 24 HOUR),'utc', 'est')", (error, rows) => {
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

  let result = await retriveRecentSoldBids(event.username, event.authKey)

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