import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  let response = undefined;
  let getBuyerAuth = (username, price) => {
    return new Promise((resolve, reject) => {
        pool.query("select authKey from buyerTable where username=? and availableFunds>=?", [username, price], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                if(rows[0].authKey == event.authKey){
                  return resolve(true)                  
                }else{
                  return resolve(false)
                }
                
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let buyItem = (itemId, username) => {
    return new Promise((resolve, reject) => {
        pool.query("update itemTable set buyerUsername =?, active=0, endDate= convert_tz(NOW(),'utc', 'est') where itemId =?", [username, itemId], (error, results) => {
            if (error) { return reject(error) }
            if (results.affectedRows != 0) {
              pool.query("select * from itemTable where itemId =?", [itemId], (error, rows) => {
                if (error) { return reject(error) }
                if ((rows) && (rows.length != 0)) {
                    return resolve(rows)
                } else {
                    return reject("unable to get item")
                }
              });
            } else {
                return reject("unable to update item")
            }
        });
    });
  }
  let addBid = (itemId, username, price) => {
    let bidId = Math.floor(Math.random() * 1000000000);
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO bidTable(bidId, bidAmount, itemId, buyerUsername, date) VALUES (?, ?, ?, ?, convert_tz(NOW(),'utc', 'est'))", [bidId, price, itemId, username], (error, results) => {
            if (error) { return reject(error) }
            if (results.affectedRows != 0) {
              return resolve(true);
            } else {
                return reject("unable to insert bid");
            }
        });
    });
  }
  
  function withholdFunds(price, username){
    return new Promise((resolve, reject) => {
      pool.query("update buyerTable set availableFunds = availableFunds-? where username = ?", [price, username], (error, results) => {
          if (error) { return reject(error) }
          if (results.affectedRows != 0) {
            return resolve(true);
          } else {
              return reject("Funds Not Disrubuted");
          }
      });
    });
  }
  
  let buyerAuthCheck = await getBuyerAuth(event.username, event.price);
  
  if(buyerAuthCheck){
    let boughtItem = await buyItem(event.itemId, event.username)
    if(boughtItem){
      let addedBid = await addBid(event.itemId, event.username, event.price); 
      if(addedBid){
        let allocateFunds = await withholdFunds(event.price, event.username);
        if(allocateFunds){
          response ={
            "statusCode" : 200,
            "message": "Item has Been Bought",
            "response" : boughtItem
          }
        }else{
          response ={
            "statusCode" : 400,
            "response" : "Couldn't Buy Item"
          }
        }
        
      }else{
      response ={
        "statusCode" : 400,
        "response" : "Couldn't Place Buy Now Bid"
      }
    }
    
    }else{
      response ={
        "statusCode" : 400,
        "response" : "Buy Item Failed"
      }
    }
    
  }else{
    response ={
      "statusCode" : 400,
      "response" : "Authenication Failed"
    }
  }
  
  pool.end()
  return response;
}
