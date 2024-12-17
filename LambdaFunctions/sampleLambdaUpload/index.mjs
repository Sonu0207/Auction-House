import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  let getAdmin = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("select * from adminTable where username=?", [id], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
 
  let result = await getAdmin(event.id)
  
  return {
    statusCode: 200,
    body: result
  }
}