const prisma = require('../../config/prisma');

class LinkItemRepository {
  async findById(id) {
    return await prisma.linkItem.findUnique({
      where: { id }
    });
  }

  async incrementClicks(id) {
    return await prisma.linkItem.update({
      where: { id },
      data: {
        clicks: { increment: 1 }
      }
    });
  }

  async upsertDailyClick(linkItemId, smartLinkId, date) {
    return await prisma.linkItemDailyMetric.upsert({
      where: {
        linkItemId_date: {
          linkItemId,
          date
        }
      },
      update: {
        clicks: { increment: 1 }
      },
      create: {
        linkItemId,
        smartLinkId,
        date,
        clicks: 1
      }
    });
  }

  async findDailyMetricsBySmartLink(smartLinkId, startDate, endDate) {
    return await prisma.linkItemDailyMetric.findMany({
      where: {
        smartLinkId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });
  }
}

module.exports = new LinkItemRepository();
