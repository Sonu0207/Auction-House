import mysql from 'mysql';

export const handler = async (event) => {
  const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });

  const { sortBy, order } = event;
  const validSortByFields = ['price', 'publishDate', 'endDate'];
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
    WHERE fulfilledDate > convert_tz(DATE_SUB(NOW(), INTERVAL 24 HOUR),'utc', 'est')
    ORDER BY ?? ${sqlOrder}
  `;

  return new Promise((resolve, reject) => {
    pool.query(query, [sortBy], (error, results) => {
      pool.end();
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
};