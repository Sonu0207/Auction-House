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
  
  let addItem = (sellerId, image, itemName, description, price, publishDate, endDate) => {
    let itemId = Math.floor(Math.random() * 1000000000);
    return new Promise((resolve, reject) => {
      if(sellerId != null && image != "" && image != undefined && itemName != "" && description != "" && price > 0){
        pool.query("insert into itemTable(itemId, sellerUsername, buyerUsername, itemName, description, price, publishDate, endDate, image, frozen, active, archive, fullfilled) VALUES (?, ?, null, ?, ?, ?, ?, ?, ?, FALSE, FALSE, FALSE, FALSE)", [itemId, sellerId, itemName, description, price, publishDate, endDate, image], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              return resolve(true)
            } else {
                return resolve(false)
            }
        });
      }
      else {
        return resolve(false)
      }
    });
  }
 
  let result = await addItem(event.username, event.image, event.name, event.desc, event.price, event.publishDate, event.endDate)
  
  if(result){
    response = {
      statusCode: 200,
      body: result
    }
  }
  else{ 
    response = { 
      statusCode: 400, 
      body: {"response" : "account was not closed"}
    }
  }
  pool.end(); 
  return response; 
}