const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Repo = sequelize.define('repo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING,
  url: Sequelize.STRING
}, {
    timestamps: false,
    underscored: true
  }
);

module.exports = Repo;
