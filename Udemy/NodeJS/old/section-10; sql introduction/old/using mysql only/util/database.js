// connecting our app with the sql database
// and giving us back a connection object which allows us to run queries

// importing the mysql package
const mysql = require('mysql2');

// connecting to our db
// theres 2 ways of doing it
// 1. setup one connnection which we can then use to run queries
    // and we should always close the connection once we're done with a query
    // (-) we need to re-execute the code to create the connection for every new query
// 2. create a connection pool
// we will use the latter option

// creating a connection pool 
const pool = mysql.createPool({
    // information about database host/engine
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'pass123.'
})

// exporting pool using promise
module.exports = pool.promise();