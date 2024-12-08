const express = require('express');
const homepageController = require('../controllers/homepage');
const router = express.Router();
router.get('/', homepageController.getHomepage);
module.exports = router;