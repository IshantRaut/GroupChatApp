const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
module.exports = router;