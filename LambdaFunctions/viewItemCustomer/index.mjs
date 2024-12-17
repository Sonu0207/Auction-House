import mysql from 'mysql'

export const handler = async (event) => {
  
  let response = undefined;
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  let viewItem = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("select * itemTable where itemID=?", [id], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        });
    });
  }
 
  let result = await viewItem(event.id)

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