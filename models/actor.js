const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Actor = sequelize.define('actor', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    login: Sequelize.STRING,
    avatar_url: Sequelize.STRING
}, {
        timestamps: false,
        underscored: true
    }
);

module.exports = Actor;
