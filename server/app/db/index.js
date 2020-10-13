const mysql = require('mysql');

// Create a pool
const pool  = mysql.createPool({
  connectionLimit : 10,
  queueLimit: 100,
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'savednotes',
  connectTimeout: 10000,
  waitForConnections: true,
  acquireTimeout: 10000,
  debug: false
});

// Select the database
pool.getConnection((err, conn) => {
  if (err) throw err;
  conn.query(`USE ${process.env.DB_NAME}`,(err) => {
    if (err) throw err;
    conn.release();
  });
});

// Returns a connection to the database
const getConnection = (callback) => {
  pool.getConnection((err, conn) => {
    if (err) console.log("err", err)
    callback(err, conn);
  });
};

// Helper function for querying the database; releases the database connection
const query = (queryString, params, callback) => {
  getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query(queryString, params, (err, rows) => {
      conn.release();
      if (err) return callback(err);
      return callback(err, rows);
    });
  });
};

// Heartbeat function to keep the connection to the database up
const keepAlive = () => {
  getConnection((err, conn) => {
    if (err) throw err;
    conn.ping();
    conn.release();
  });
};

// Set up a keepalive heartbeat
setInterval(keepAlive, 30000);

exports.query = query;
