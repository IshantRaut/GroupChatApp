const express = require('express');

const userAuthentication = require('../middleware/auth');
const chatController = require('../controllers/chat');
const router = express.Router();
router.get('/chat', chatController.getChat);
router.post('/chat', userAuthentication.authenticate, chatController.postChat);
router.get('/all-chats', chatController.getAllChats);

module.exports = router;