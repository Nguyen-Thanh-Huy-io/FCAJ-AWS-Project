const express = require('express');
const reportController = require('../../controllers/workspace/report.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
const checkPermission = require('../../middlewares/permission.middleware');

const router = express.Router();

// Apply auth to all report endpoints
router.use(verifyAuth);

/**
 * GET /api/reports?brandId=...
 * Get reports list
 */
router.get('/', checkPermission('VIEW_ANALYTICS'), reportController.getReports);

/**
 * POST /api/reports?brandId=...
 * Generate a new report
 */
router.post('/', checkPermission('VIEW_ANALYTICS'), reportController.generateReport);

/**
 * DELETE /api/reports/:id?brandId=...
 * Delete a report
 */
router.delete('/:id', checkPermission('VIEW_ANALYTICS'), reportController.deleteReport);

module.exports = router;
