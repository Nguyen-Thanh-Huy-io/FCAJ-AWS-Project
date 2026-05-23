const teamService = require('../services/team.service');

class TeamController {
  async getTeamMembers(req, res) {
    try {
      const brandId = req.query.brandId || 'default-brand';
      const result = await teamService.getTeamMembers(req.query, brandId);

      res.status(200).json({
        message: 'Team members retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TeamController();
