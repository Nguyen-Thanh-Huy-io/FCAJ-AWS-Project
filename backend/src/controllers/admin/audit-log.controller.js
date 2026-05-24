const auditLogService = require('../../services/admin/audit-log.service');

class AuditLogController {
  /**
   * GET /api/admin/audit-logs
   * Fetch all audit logs with query filter params
   */
  async getAuditLogs(req, res) {
    try {
      const result = await auditLogService.getAuditLogs(req.query);

      res.status(200).json({
        message: 'Audit logs retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to retrieve audit logs'
      });
    }
  }
}

module.exports = new AuditLogController();
