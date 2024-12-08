const express = require('express');

const authentication = require('../middleware/auth');
const userController = require('../controllers/user');
const requestController = require('../controllers/request');
const router = express.Router();

router.get('/groups', authentication.authenticateUser, userController.getUserGroups);
router.post('/createGroup', authentication.authenticateUser, userController.postCreateGroup);
router.get('/pendingGroupRequests', authentication.authenticateUser, requestController.getPendingRequests);
router.post('/confirmGroupRequest', authentication.authenticateUser, requestController.postConfirmRequest);
module.exports = router;