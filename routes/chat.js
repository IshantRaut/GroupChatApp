const express = require('express');
const chatController = require('../controllers/chat');
const router = express.Router();
router.get('/chat', chatController.getChat);
router.post('/chat', chatController.postChat);
router.get('/all-chats', chatController.getAllChats);
module.exports = router;