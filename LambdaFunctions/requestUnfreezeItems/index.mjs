import mysql from 'mysql';

export const handler = async (event) => {
  let response;

  const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });

  // Check if the request has already been sent
    const checkRequestExists = (itemId) => {
      return new Promise((resolve, reject) => {
        const query = `SELECT 1 FROM requestTable WHERE itemId = ? and approvedDate is null 
                        LIMIT 1`;
        pool.query(query, [itemId], (error, result) => {
          if (error) return reject(error);
          resolve(result.length > 0);
        });
      });
    };
// Get the next request ID
  const getNextrequestId = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COALESCE(MAX(requestId), 0) + 1 AS nextId FROM requestTable';
      pool.query(query, (error, result) => {
        if (error) return reject(error);
        resolve(result[0].nextId);
      });
    });
  }

  // Insert a new request
  const insertRequest = (requestId, sellerUsername, itemId) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO requestTable (requestId, itemId, submitDate) 
        SELECT ?, ?, convert_tz(NOW(), 'utc', 'est') 
        FROM itemTable 
        WHERE sellerUsername = ? AND itemId = ? AND frozen = 1
      `;
      pool.query(query, [requestId, itemId, sellerUsername, itemId], (error, result) => {
        if (error) return reject(error);
        resolve(result.affectedRows > 0);
      });
    });
  };

  try {
    const requestExists = await checkRequestExists(event.itemId);

    if (requestExists) {
      response = {
        statusCode: 400,
        body: { response: "Request already sent for this item" }}
    }
    else {
      const nextrequestId = await getNextrequestId();
      const success = await insertRequest(nextrequestId, event.sellerUsername, event.itemId);
      response = {
        statusCode: success ? 200 : 400,
        body: success
          ? { response: "Unfreeze request submitted successfully" }
          : { response: "Failed to submit unfreeze request" }
      };
    }
  } 
  catch (error) {
    response = {
      statusCode: 500,
      body: { error: error.message }
    };
  }
  finally {
    pool.end();
  }
  return response;
};