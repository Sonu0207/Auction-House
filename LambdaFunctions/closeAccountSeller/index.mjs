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
  
  let closeSeller = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("Select count(*) as CNT from itemTable where active = ? and sellerUsername= ? group by sellerUsername", [1, username], (error, rows) => {
        if(error){ return reject(error) }
        console.log(rows)
        if(rows.length >0 && rows[0].CNT >0){
          resolve(false)
        }
        else{
          pool.query("update sellerTable set password='teacup314159' where username=?", [username], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        });
        }}
        ); 
    });
  }
 
  let result = await closeSeller(event.username)

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