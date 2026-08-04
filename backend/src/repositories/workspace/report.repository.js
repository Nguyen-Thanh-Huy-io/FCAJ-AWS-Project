const prisma = require('../../config/prisma');

class ReportRepository {
  async findManyByBrand(brandId) {
    return prisma.report.findMany({
      where: { brandId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async create(data) {
    return prisma.report.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async update(id, data) {
    return prisma.report.update({
      where: { id },
      data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async delete(id) {
    return prisma.report.delete({
      where: { id }
    });
  }
}

const reportRepository = new ReportRepository();
module.exports = reportRepository;
