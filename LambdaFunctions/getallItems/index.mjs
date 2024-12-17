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
  
  let getAllActiveItems = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from itemTable where active=true", (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return resolve(false)
            }
        });
    });
  }
 
  let result = await getAllActiveItems(event.id)

  if(result){
    response = {
      statusCode: 200,
      body: result
    }
  }
  else{
    response =  {
      statusCode: 400, 
      body: {"response" : "items not gotten"}
    }
  }
   pool.end(); 
   return response; 
}