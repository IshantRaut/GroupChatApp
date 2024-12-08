const path = require('path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const homepageRoutes = require('./routes/homepage');
const errorController = require('./controllers/error');

const app = express();

app.use(cors({ origin: '*' }));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(homepageRoutes);
app.use('/user', userRoutes);
app.use(errorController.get404);


sequelize.sync()
.then((result) => app.listen(process.env.PORT || 3000))
.catch((err) => console.log(err));