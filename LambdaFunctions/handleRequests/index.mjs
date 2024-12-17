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
  
  let unfreezeItem = (itemId) => {
    return new Promise((resolve, reject) => {
        pool.query("update itemTable set frozen=0 where itemId = ?", [itemId], (error, results) => {
            console.log(results)
            console.log(results.affectedRows !== 0)
            if (error) { return reject(error) }
            if (results.affectedRows !== 0) {
                return resolve(true)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  
  let settleRequest = (requestId) => {
    return new Promise((resolve, reject) => {
        pool.query("update requestTable set approvedDate= convert_tz(NOW(),'utc', 'est') where requestId = ?", [requestId], (error, results) => {
            console.log(results)
            console.log(results.affectedRows !== 0)
            if (error) { return reject(error) }
            if (results.affectedRows !== 0) {
                return resolve(true)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let response = undefined;
  let result = await authAdmin(event.username)
  if(result){
    let unfroze = await unfreezeItem(event.itemId)
    if(unfroze){
      let fufilled = await settleRequest(event.requestId)
      response ={
        statusCode: 200,
        body: "Item Has been Unfrozen"
      }
    }else{
        response ={
                statusCode: 400,
                body: "Item Has not Been unfrozen"
              }      
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