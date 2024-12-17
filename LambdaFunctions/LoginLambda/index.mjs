import mysql from 'mysql'
import { encrypt, decrypt } from './encrypt';
export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  
  let validateSellerLogin = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("select username, authKey, password from sellerTable where username=?", [id], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
 
  let validateBuyerLogin = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("select username, authKey, password from buyerTable where username=?", [id], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }

  let validateAdminLogin = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("select username, authKey, password from adminTable where username=?", [id], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let result = {
            statusCode: 400,
            body: "Couldn't Pull Data"
            };
  let userType = event.type
  let data;
  switch (userType){
    case buyer:
      data = await validateBuyerLogin(event.username);
      if (data[0].password==decrypt(event.password)){
        result = {
            statusCode: 200,
            body: {"username" : data[0].username, "authKey": data[0].authKey, "userType": "buyer"}
        }
      }else{
        result = {
          statusCode: 400,
          body: "Incorrect Password, Please Try Again"
      }
      }
      break;
    case seller:
      data = await validateSellerLogin(event.username);
      if (data[0].password==decrypt(event.password)){
        result = {
            statusCode: 200,
            body: {"username" : data[0].username, "authKey": data[0].authKey, "userType": "seller"}
        }
      }else{
        result = {
          statusCode: 400,
          body: "Incorrect Password, Please Try Again"
      }
      }
      break;
    default:
      data = await validateAdminLogin(event.username);
      if (data[0].password==decrypt(event.password)){
        result = {
            statusCode: 200,
            body: {"username" : data[0].username, "authKey": data[0].authKey, "userType": "admin"}
        }
      }else{
        result = {
          statusCode: 400,
          body: " Congrats you got to the admin login but Incorrect Password, Please Try Again"
      }
      }
      break;
  }
    
  
  return result;
}
const tester = {
  "username": "seller",
  "passcode": {iv: "771e99fd6d57ae4a5c24da84716d5fb7", encryptedData: "e7b992270fe7e07a688ccda0e9275f77"},
  "userType": "seller"
};