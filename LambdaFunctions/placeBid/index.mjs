import mysql from 'mysql'

export const handler = async (event) => {
  
  let response = undefined
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  let placeBid = (itemId, bidAmount, buyerUsername, authKey) => {
    let bidId = Math.floor(Math.random() * 1000000000);
    return new Promise((resolve, reject) => {
      pool.query("SELECT username FROM buyerTable WHERE username=? and authKey=? and availableFunds >= ?", [buyerUsername, authKey, bidAmount], (error, rows) => {
          if (error) { return reject(error) }
          if ((rows) && (rows.length != 0)) {
            pool.query("SELECT frozen, endDate, buyerUsername FROM itemTable WHERE itemId=? and frozen=False and endDate > NOW() and price <= ? and (buyerUsername is null or buyerUsername != ?)", [itemId, bidAmount, buyerUsername], (error, rows) => {
                if (error) { return reject(error) }
                if ((rows) && (rows.length != 0)) {
                  pool.query("INSERT INTO bidTable(bidId, bidAmount, itemId, buyerUsername, date) VALUES (?, ?, ?, ?, NOW())", [bidId, bidAmount, itemId, buyerUsername], (error, rows) => {
                      if (error) { return reject(error) }
                      if ((rows) && (rows.length != 0)) {
                        pool.query("UPDATE itemTable SET buyerUsername=?, price=? WHERE itemId=?", [buyerUsername, (Number(bidAmount)+1), itemId], (error, rows) => {
                            if (error) { return reject(error) }
                            if ((rows) && (rows.length != 0)) {
                              pool.query("SELECT MAX(bidAmount) as previousBid FROM bidTable WHERE buyerUsername=? and bidAmount != ? GROUP BY buyerUsername", [buyerUsername, bidAmount], (error, rows) => {
                                  if (error) { return reject(error) }
                                  if ((rows) && (rows.length != 0)) {
                                    pool.query("UPDATE buyerTable SET availableFunds=availableFunds-?+? WHERE username=?", [bidAmount, rows[0].previousBid, buyerUsername], (error, rows) => {
                                        if (error) { return reject(error) }
                                        if ((rows) && (rows.length != 0)) {
                                          return resolve(false)
                                        } else {
                                            return resolve("Available funds not updated")
                                        }
                                    });
                                  } else {
                                    pool.query("UPDATE buyerTable SET availableFunds=availableFunds-? WHERE username=?", [bidAmount, buyerUsername], (error, rows) => {
                                        if (error) { return reject(error) }
                                        if ((rows) && (rows.length != 0)) {
                                          return resolve(false)
                                        } else {
                                            return resolve("Available funds not updated")
                                        }
                                    });
                                  }
                              });
                            } else {
                                return resolve("Cannot retrieve if there were previous bids")
                            }
                        });
                      } else {
                          return resolve("Bid not added")
                      }
                  });
                } else {
                    return resolve("Item is frozen, endDate has passed, buyer cannot place two bids in a row, or bid amount does not exceed price")
                }
            });
          } else {
              return resolve("Authentication failed or not enough available funds")
          }
      });
    });
  }
 
  let result = await placeBid(event.itemId, event.bidAmount, event.buyerUsername, event.authKey)
  
  if(!result){
    response = {
      statusCode: 200,
      body: {"response": "Bid successfully placed"}
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