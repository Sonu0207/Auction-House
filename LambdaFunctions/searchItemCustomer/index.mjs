import mysql from 'mysql';

export const handler = async (event) => {
  const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });

  const { searchQuery } = event; // Expecting search query as input

  // Basic validation for search query
  if (!searchQuery || searchQuery.trim() === '') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Search query is required.' }),
    };
  }

  const query = `
    SELECT * FROM itemTable
    WHERE (itemName LIKE ? OR description LIKE ?) and active=1 and frozen = 0
  `;

  // Add wildcards for LIKE search
  const searchTerm = `%${searchQuery}%`;

  return new Promise((resolve, reject) => {
    pool.query(query, [searchTerm, searchTerm], (error, results) => {
      if (error) {
        pool.end((endError) => {
          if (endError) {
            console.error('Error closing pool:', endError.message);
          }
          reject({
            statusCode: 500,
            body: JSON.stringify({ message: 'Database error', error: error.message }),
          });
        });
      } else {
        pool.end((endError) => {
          if (endError) {
            console.error('Error closing pool:', endError.message);
            reject({
              statusCode: 500,
              body: JSON.stringify({ message: 'Error closing connection pool.' }),
            });
          } else {
            resolve({
              statusCode: 200,
              body: results, // Retained original response format
            });
          }
        });
      }
    });
  });
};