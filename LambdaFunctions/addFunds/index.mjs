import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
    });

    // Add funds to the buyer's account
    const addFunds = (username, amount) => {
        return new Promise((resolve, reject) => {
            if (amount <= 0)
                 {
                return reject("Invalid amount. Please enter a positive value.");
                }
            const query = ` UPDATE buyerTable SET availableFunds = availableFunds + ?, totalFunds = totalFunds + ? WHERE username = ?`;
            pool.query(query, [amount, amount, username], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.affectedRows === 0) {
                    return reject("Buyer not found.");
                }
                // Fetch updated Funds for dashboard
                const getUpdatedFundsQuery = ` SELECT availableFunds, totalFunds FROM buyerTable WHERE username = ?`;
                pool.query(getUpdatedFundsQuery, [username], (error, updatedResults) => {
                    if (error) {
                        return reject(error);
                    }
                    if (updatedResults.length === 0) {
                        return reject("Buyer not found.");
                    }
                    const updatedFunds = updatedResults[0];
                    resolve(updatedFunds); // Return updated funds
                });
            });
        });
    };
    
    let result = {
        statusCode: 400,
        body: "Couldn't process the request",
    };

    // Extracting data from the event
    const { username, amount } = event;

    try {
        const updatedFunds = await addFunds(username, amount);
        result = {
            statusCode: 200, 
            body: { message: "Funds added successfully." , 
                    updatedFunds: updatedFunds // Including updated funds in response to update the dasboard on Buyer page
                }}
        } 
     catch (error) {
        result = { 
            statusCode: 400, body: error }
        } 
     finally { 
        pool.end()
        }
    return result;
}