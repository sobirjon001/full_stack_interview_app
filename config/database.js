// import libraries
import { createPool } from "mysql";

// creating mysql connection
const mysqlHost = process.env.MYSQL_HOST || "localhost";
const mysqlPort = process.env.MYSQL_PORT || "3306";
const mysqlUser = process.env.MYSQL_USER || "root";
const mysqlPass = process.env.MYSQL_PASS || "root";
const mysqlDB = process.env.MYSQL_DB || "node_db";
const pool = createPool({
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  password: mysqlPass,
  database: mysqlDB,
  connectionLimit: 10,
});

module.exports = pool;
