const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Admin = sequelize.define('admins', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }
});
module.exports = Admin;