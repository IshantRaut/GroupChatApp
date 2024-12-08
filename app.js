const path = require('path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const Request = require('./models/request');
const userRoutes = require('./routes/user');
const homepageRoutes = require('./routes/homepage');

const errorController = require('./controllers/error');

const app = express();

app.use(cors({ origin: '*' }));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(homepageRoutes);
app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use(errorController.get404Page);


User.hasMany(Chat);
Chat.belongsTo(User);

// Group -> Chat : one to many
Group.hasMany(Chat);
Chat.belongsTo(Group);
// User -> Group : many to many
User.belongsToMany(Group, { through: 'User_Group' });
Group.belongsToMany(User, { through: 'User_Group' });
// User -> Request : one to many
User.hasMany(Request);
Request.belongsTo(User);
// Group -> Request : one to many
Group.hasMany(Request);
Request.belongsTo(Group);

sequelize.sync()
.then((result) => app.listen(process.env.PORT || 3000))
.catch((err) => console.log(err));