const path = require("path")
const bcrypt = require('bcrypt');
const User = require('../models/user');
exports.getSignup = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
}
exports.postSignup = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const phoneNumber = req.body.phNumber;
    const password = req.body.password;
    if(!username || !email || !phoneNumber || !password){
        res.status(400).json({ msg: 'All fields are required' });
        return;
    }
    if(phoneNumber.length != 10){
        res.status(400).json({ msg: 'Invalid Phone Number' });
        return;
    }
    try{
        const hash = await bcrypt.hash(password, 10); // 10 salt rounds
        const user = await User.create({
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            password: hash
        });
        res.status(201).json({ userData: user, msg: 'User added successfuly' });
    }catch(err){
        if(err.name === 'SequelizeUniqueConstraintError'){
            res.status(400).json({ error: err, msg: 'Email is already registered' });
            return;
        }
        console.log('POST USER SIGNIN ERROR');
        res.status(500).json({ error: err, msg: 'Could not add user' });
    }
}