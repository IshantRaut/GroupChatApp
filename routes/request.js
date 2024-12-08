const express = require('express');
const userAuthentication = require('../middleware/auth');
const requestController = require('../controllers/request');
const router = express.Router();
//user
router.post('/generate-request/:groupId', userAuthentication.authenticateUserGroup, requestController.postGenerateRequest);
//user
router.get('/pending-requests', userAuthentication.authenticateUser, requestController.getPendingRequests);
//user
router.post('/confirm-request/:groupId', userAuthentication.authenticateUser, requestController.postConfirmRequest);
module.exports = router;