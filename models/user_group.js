const sequelize = require('../util/database');
const User_Group = sequelize.define('user_group', {}, { timestamps: false });
module.exports = User_Group;