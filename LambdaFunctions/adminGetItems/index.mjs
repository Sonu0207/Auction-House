import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  let authAdmin = (username) => {
    return new Promise((resolve, reject) => {
        pool.query("select authKey from adminTable where username=?", [username], (error, rows) => {
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
  
  let getItems = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from itemTable", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }

  let response = undefined;
  let result = await authAdmin(event.username)
  if(result){
    response ={
        statusCode: 200,
        body: await getItems()
      }
  }else{
    response = {
      statusCode: 400,
        body: "Not Authenticated"
    }
  }
  pool.end()
 return response
}