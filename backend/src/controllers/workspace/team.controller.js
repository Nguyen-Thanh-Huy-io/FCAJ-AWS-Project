const teamService = require('../../services/workspace/team.service');
const asyncHandler = require('../../utils/async-handler');

class TeamController {
  getTeamMembers = asyncHandler(async (req, res) => {
    const brandId = req.query.brandId || 'default-brand';
    const result = await teamService.getTeamMembers(req.query, brandId);

    res.status(200).json({
      message: 'Team members retrieved successfully',
      ...result
    });
  });
}

module.exports = new TeamController();
