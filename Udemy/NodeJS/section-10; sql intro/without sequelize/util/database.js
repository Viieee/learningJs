/* const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'pass123.', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
 */

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "pass123.",
});

// allowing us to use promises when working with the connections 
module.exports = pool.promise();