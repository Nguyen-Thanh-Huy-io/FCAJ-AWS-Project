const prisma = require('../../config/prisma');

class CompetitorRepository {
  async createCompetitor(brandId, platform, competitorData) {
    return prisma.competitorAnalysis.create({
      data: {
        brandId,
        platform,
        competitorHandle: competitorData.competitorHandle,
        competitorDisplayName: competitorData.competitorDisplayName,
        competitorAvatarUrl: competitorData.competitorAvatarUrl,
        followersCount: competitorData.followersCount,
        addedAt: new Date()
      }
    });
  }

  async getCompetitors(brandId, platform) {
    return prisma.competitorAnalysis.findMany({
      where: { brandId, platform },
      orderBy: { addedAt: 'desc' }
    });
  }

  async deleteCompetitor(id) {
    return prisma.competitorAnalysis.delete({
      where: { id }
    });
  }
}

module.exports = new CompetitorRepository();
