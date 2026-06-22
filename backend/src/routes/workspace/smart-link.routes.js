const express = require('express');
const smartLinkController = require('../../controllers/workspace/smart-link.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Private Endpoints
router.get('/', verifyAuth, smartLinkController.getSmartLink);
router.post('/', verifyAuth, smartLinkController.createSmartLink);
router.put('/:id', verifyAuth, smartLinkController.updateSmartLink);

// Public Endpoints
router.get('/public/:slug', smartLinkController.getPublicSmartLink);
router.post('/click/:linkItemId', smartLinkController.trackLinkClick);

module.exports = router;
