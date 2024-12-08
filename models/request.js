const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Request = sequelize.define('requests', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
        allowNull: false
    }
});
module.exports = Request;