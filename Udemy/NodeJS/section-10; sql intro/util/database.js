const Sequelize = require("sequelize").Sequelize

const sequelize = new Sequelize('node-complete', 'root', 'pass123.', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;