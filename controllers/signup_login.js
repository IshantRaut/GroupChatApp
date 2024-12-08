const path = require("path")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
function generateAccessToken(user){
    return jwt.sign({ 
        userId: user.id, 
        username: user.username 
    }, process.env.JWT_SECRET_KEY);
}
exports.getSignupPage = (req, res) => {
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
            username: user.username,
            email: user.email
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
exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}
exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        res.status(400).json({ msg: 'All fields are required' });
        return;
    }
    
    try{
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            res.status(404).json({ msg: 'Email not registered' });
            return;
        }
        
        const hash = user.password;
        const match = await bcrypt.compare(password, hash);
        if(match){
            res.status(200).json({
                msg: 'User logged in successfully',
                token: generateAccessToken(user)
            });
        }else{
            res.status(401).json({ msg: 'Incorrect Password' });
        }
    }catch(err){
        console.log('POST USER LOGIN ERROR');
        res.status(500).json({ error: err, msg: 'Could not fetch user' });
    }
}