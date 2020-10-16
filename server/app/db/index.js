const mysql = require('mysql');
require("dotenv").config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "savednotes",
});

conn.connect();

const query = (sql, callback) => {
  conn.query(sql, (error, results) => callback(error, results));
}

module.exports = { query };
