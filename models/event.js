const moment = require('moment');
const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');
const Actor = require('./actor');
const Repo = require('./repo');

const Event = sequelize.define('event', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    type: Sequelize.STRING,
    created_at: {
        type: Sequelize.DATE,
        get() {
            const date = this.getDataValue('created_at');
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}, {
        timestamps: false,
        underscored: true
    }
);

Event.belongsTo(Actor);
Event.belongsTo(Repo);
Actor.hasMany(Event);

module.exports = Event;
