const path = require('path');
exports.get404Page = (req, res) => { 
    res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
};