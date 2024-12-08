const path = require("path")
exports.getSignup = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
}
exports.postSignup = (req, res) => {
    console.log(req.body);
    console.log('POST SIGNUP');
    res.status(201).json({ msg: 'User added successfuly'});
}