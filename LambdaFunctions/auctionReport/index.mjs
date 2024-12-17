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
  
  let getBuyerFunds = () => {
    return new Promise((resolve, reject) => {
        pool.query("select SUM(availableFunds) as aSum, SUM(totalFunds) as tSum from buyerTable", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let getSellerFunds = () => {
    return new Promise((resolve, reject) => {
        pool.query("select SUM(revenue) from sellerTable", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let getTopSeller = () => {
    return new Promise((resolve, reject) => {
        pool.query("select username, revenue from sellerTable where revenue in (select MAX(revenue) from sellerTable)", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }

  let getTopBuyer = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from (select buyerUsername, count(buyerUsername) as numItems from itemTable group by buyerUsername) as AAT where numItems in (select MAX(numItems) from (select buyerUsername, count(buyerUsername) as numItems from itemTable group by buyerUsername) as dt) group by buyerUsername;", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }

  let getNTrans = () => {
    return new Promise((resolve, reject) => {
        pool.query("select count(*) as num from bidTable", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let getTFunds = () => {
    return new Promise((resolve, reject) => {
        pool.query("select SUM(bidAmount) as SUM from bidTable", [], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows)
            } else {
                return reject("unable to locate table")
            }
        });
    });
  }
  let getEItem = () => {
    return new Promise((resolve, reject) => {
        pool.query("select itemId, price from itemTable where price in (select MAX(price) from itemTable)", [], (error, rows) => {
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
        buyerFunds: await getBuyerFunds(),
        sellerFunds: await getSellerFunds(),
        topSeller: await getTopSeller(),
        topBuyer: await getTopBuyer(),
        numTrans : await getNTrans(),
        fundsTrans: await getTFunds(),
        eItem : await getEItem()
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