const revenueService = require('../../services/admin/revenue.service');

class RevenueController {
  async getRevenueDashboard(req, res) {
    try {
      const data = await revenueService.getDashboardData();
      res.status(200).json({
        message: 'Revenue dashboard data retrieved successfully',
        data
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RevenueController();
