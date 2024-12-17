import mysql from 'mysql';

export const handler = async (event) => {
  const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });

  const { sortBy, order } = event;
  const validSortByFields = ['itemName', 'price', 'publishDate', 'endDate'];
  if (!validSortByFields.includes(sortBy)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid sortBy field.' }),
    };
  }

  const validOrders = ['ascending', 'descending'];
  if (!validOrders.includes(order)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid order. Use "ascending" or "descending".' }),
    };
  }

  const sqlOrder = order === 'ascending' ? 'ASC' : 'DESC';

  const query = `
    SELECT * FROM itemTable
    WHERE active = 1 and frozen = 0
    ORDER BY ?? ${sqlOrder}
  `;

  return new Promise((resolve, reject) => {
    pool.query(query, [sortBy], (error, results) => {
      pool.end((endError) => {
        if (endError) {
          console.error('Error closing pool:', endError.message);
          return reject({
            statusCode: 500,
            body: JSON.stringify({ message: 'Error closing connection pool.' }),
          });
        }

        if (error) {
          reject({
            statusCode: 500,
            body: JSON.stringify({ message: 'Database error', error: error.message }),
          });
        } else {
          resolve({
            statusCode: 200,
            body: results,
          });
        }
      });
    });
  });
};