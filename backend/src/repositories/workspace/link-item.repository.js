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
}

module.exports = new LinkItemRepository();
