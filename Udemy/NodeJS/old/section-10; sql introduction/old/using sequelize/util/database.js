// importing sequelize package
const Sequelize = require('sequelize');

// making an object from the imported package
// this will automatically setting up a connection pool
const sequelize = new Sequelize('node-complete', 'root', 'pass123.', 
{dialect: 'mysql', host: 'localhost'}
);

// exporting the database connection pool
module.exports = sequelize;