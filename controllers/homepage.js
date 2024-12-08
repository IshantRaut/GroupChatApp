const path = require('path');
exports.getHomepage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'homepage.html'));
};