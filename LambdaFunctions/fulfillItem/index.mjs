import mysql from 'mysql';

export const handler = async (event) => {
  let response = undefined;

  const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database
  });
  let getSellerAuth = (username) => {
    return new Promise((resolve, reject) => {
        pool.query("select authKey from sellerTable where username=?", [username], (error, rows) => {
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
  let getCheckValid = (username, item) => {
    return new Promise((resolve, reject) => {
        pool.query("select * from itemTable where sellerUsername=? and itemId=? and fullfilled = 0 and frozen =0 and buyerUsername is not null and endDate < convert_tz(NOW(),'utc', 'est')", [username, item], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
                return resolve(rows);
            } else {
                return reject("unable to locate item")
            }
        });
    });
  }
  let checkActiveBids = (item) => {
    return new Promise((resolve, reject) => {
        pool.query("select * from bidTable where itemId=? ", [item], (error, rows) => {
            console.log(rows);
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              if((rows) && (rows.length == 1)){
                return resolve({"responds" : "single", "data": rows});                
              }else{
                return resolve({"responds" : "multi", "data": rows});
              }
                
            } else {
                return reject("No Bids")
            }
        });
    });
  }
  let getWinner = (itemId) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT buyerUsername, bidAmount FROM bidTable WHERE itemId=? AND bidAmount = (SELECT MAX(bidAmount)from bidTable where itemId=?);", [itemId, itemId], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              return resolve({"finalPrice" : rows[0].bidAmount, "buyer": rows[0].buyerUsername})
                
            } else {
                return reject("Seller Funds Allocated")
            }
        });
    });
  }
  let clearBidFunds = (itemId, buyer) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT buyerUsername, MAX(bidAmount) as returnFunds from bidTable where itemId=? and buyerUsername != ? group by buyerUsername", [itemId, buyer], (error, rows) => {
        if (error) { return reject(error) }
        if ((rows) && (rows.length != 0)) {
          let numberofBids = 0
          for(let i = 0; i < rows.length; i++){
            pool.query("UPDATE buyerTable SET availableFunds=availableFunds+? WHERE username=?", [rows[i].returnFunds, rows[i].buyerUsername], (error, rows) => {
                if (error) { return reject(error) }
                if ((rows) && (rows.length != 0)) {
                  numberofBids++;
                  console.log("Returned Funds to ")
                } else {
                    return reject("Bid Funds not Returned")
                }
            });
           }
          return resolve(true)
        }else{
          return reject("Bid Funds not Returned")
        }
    });
  });
  }
  let removeBuyerFunds = (finalPrice, buyer) => {
    console.log(finalPrice )
    console.log(buyer )
    return new Promise((resolve, reject) => {
        pool.query("UPDATE buyerTable SET totalFunds=totalFunds-? WHERE username=?", [finalPrice, buyer], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              return resolve(true)
                
            } else {
                return reject("No Fund Removed From the Buyer")
            }
        });
    });
  }
  let fulfillItems = (itemId) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE itemTable SET fullfilled=True, active=False, fulfilledDate=convert_tz(NOW(),'utc', 'est') WHERE itemId=?", [itemId], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              return resolve(true)
                
            } else {
                return reject("Item Not Fulfilled")
            }
        });
    });
  }
  let giveSellerFunds = (finalPrice, sellerUsername) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE sellerTable SET revenue=revenue+? WHERE username=?", [finalPrice, sellerUsername], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              return resolve(true)
                
            } else {
                return reject("Seller Funds Allocated")
            }
        });
    });
  }
  let giveAuctionHouseFunds = (finalPrice) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE adminTable SET revenue=revenue+? WHERE username='Admin'", [finalPrice], (error, rows) => {
            if (error) { return reject(error) }
            if ((rows) && (rows.length != 0)) {
              return resolve(true)
                
            } else {
                return reject("Seller Funds Allocated")
            }
        });
    });
  }
  
  let sellerAuth = await getSellerAuth(event.sellerUsername)
  if(sellerAuth){
    let checkValid = await getCheckValid(event.sellerUsername, event.itemId)
    if(checkValid){
      let checkActiveBid = await checkActiveBids(event.itemId)
      if(checkActiveBid){
        let winner = await getWinner(event.itemId)
        console.log(checkActiveBid)
        if(checkActiveBid.responds == "multi"){
           let clearingLosers = await clearBidFunds(event.itemId, winner.buyer)
           if(clearingLosers){
              let subractFunds = await removeBuyerFunds(winner.finalPrice,winner.buyer)
              let fulfillItem = await fulfillItems(event.itemId)
              let houseRev = (winner.finalPrice * .05).toFixed(0)
              let getsellerFund = await giveSellerFunds(winner.finalPrice-houseRev, event.sellerUsername)
              let gethouseFund = await giveAuctionHouseFunds(houseRev)
              if(subractFunds && fulfillItem && getsellerFund && gethouseFund){
                response = { 
                  statusCode: 200, 
                  body: {"response" : "Item Has Been Fulfilled"}
                }
              }else{
                response = { 
                  statusCode: 400, 
                  body: {"response" : "Unable To Complete Transaction"}
                }
              }
           }else{
            response = { 
              statusCode: 400, 
              body: {"response" : "Failed to remove lost bids"}
            }
           }
        }else{
          let winner = await getWinner(event.itemId)
          console.log(winner);
          let subractFunds = await removeBuyerFunds(winner.finalPrice, winner.buyer)
          let fulfillItem = await fulfillItems(event.itemId)
          let houseRev = (winner.finalPrice * .05).toFixed(0)
          let getsellerFund = await giveSellerFunds(winner.finalPrice-houseRev, event.sellerUsername)
          let gethouseFund = await giveAuctionHouseFunds(houseRev)
          if(subractFunds && fulfillItem && getsellerFund && gethouseFund){
            response = { 
              statusCode: 200, 
              body: {"response" : "Item Has Been Fulfilled"}
            }
          }else{
            response = { 
              statusCode: 400, 
              body: {"response" : "Unable To Complete Transaction"}
            }
          }
        }
      }else{
        response = { 
          statusCode: 400, 
          body: {"response" : "No Bids"}
        }
      }
    }else{
      response = { 
        statusCode: 400, 
        body: {"response" : "Not Valid Item"}
      }
    }
  }else{
    response = { 
      statusCode: 400, 
      body: {"response" : "Not Authenticated to Seller"}
    }
  }
  pool.end(); 
  return response; 
}