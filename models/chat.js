const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Chat = sequelize.define('chats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    timeStamp: {
        type: Sequelize.DATE,
        allowNull: false
    }
});
module.exports = Chat;