const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Cardset = db.define('cardset',{
    ownerUid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Cardset;