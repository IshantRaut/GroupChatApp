const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    User.findByPk(user.userId)
    .then((user) => {
        req.user = user;
        next();
    })
    .catch((err) => {
        console.log('USER AUTHENTICATION ERROR');
        res.status(500).json({ error: err, msg: 'Could not fetch user' });
    });
}