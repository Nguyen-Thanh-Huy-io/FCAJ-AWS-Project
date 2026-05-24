const prisma = require('../../config/prisma');

class AutoListRepository {
  async findManyByBrand(brandId) {
    return prisma.autoList.findMany({
      where: { brandId },
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.autoList.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async create(data) {
    return prisma.autoList.create({ data });
  }

  async update(id, data) {
    return prisma.autoList.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.autoList.delete({
      where: { id }
    });
  }
}

const autoListRepository = new AutoListRepository();
module.exports = autoListRepository;
