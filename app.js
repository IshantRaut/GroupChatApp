const path = require('path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chat');
const userRoutes = require('./routes/user');
const homepageRoutes = require('./routes/homepage');
const chatRoutes = require('./routes/chat');
const errorController = require('./controllers/error');

const app = express();

app.use(cors({ origin: '*' }));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(homepageRoutes);
app.use('/user', userRoutes);
app.use(chatRoutes);
app.use(errorController.get404);


User.hasMany(Chat);
Chat.belongsTo(User);


sequelize.sync()
.then((result) => app.listen(process.env.PORT || 3000))
.catch((err) => console.log(err));