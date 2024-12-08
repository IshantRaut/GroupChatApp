const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Group = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
module.exports = Group;