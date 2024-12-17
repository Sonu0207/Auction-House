import mysql from 'mysql';

export const handler = async (event) => {
  
  let response = undefined;
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  let editItem = (sellerId, itemId, image, itemName, price, description, publishDate, endDate) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE itemTable SET itemName=?, description=?, price=?, publishDate=?, endDate=?, image=? WHERE sellerUsername = ? AND itemId = ?", [itemName, description, price, publishDate, endDate, image, sellerId, itemId], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        });
    });
  }
  let result = await editItem(event.username, event.itemId, event.image, event.name, event.price, event.desc, event.publishDate, event.endDate)

  if(result){
    response = {
      statusCode: 200,
      body: result
    }
  }
  else{ 
    response = { 
      statusCode: 400, 
      body: {"response" : "item was not added"}
    }
  }
  pool.end(); 
  return response; 
}