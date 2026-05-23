const express = require('express');
const teamController = require('../controllers/team.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

/**
 * GET /api/team
 */
router.get('/', teamController.getTeamMembers);

module.exports = router;
