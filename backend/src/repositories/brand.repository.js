const prisma = require('../config/prisma');

class BrandRepository {
  async findManyByUserId(userId) {
    return await prisma.brand.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      },
      include: {
        socialAccounts: {
          include: {
            youtubeChannel: true,
            instagramAccount: true,
            facebookPage: true,
            tikTokAccount: true,
            linkedInAccount: true
          }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        socialAccounts: true
      }
    });
  }

  async create(data) {
    // Find a free plan to assign as default
    const freePlan = await prisma.plan.findFirst({
      where: { name: 'FREE', billingCycle: 'MONTHLY' }
    });

    if (!freePlan) {
      throw new Error('Default FREE plan not found in database. Please run seed script.');
    }

    return await prisma.brand.create({
      data: {
        name: data.name,
        timezone: data.timezone || 'Asia/Ho_Chi_Minh',
        defaultLanguage: data.defaultLanguage || 'vi',
        owner: {
          connect: { id: data.ownerId }
        },
        subscription: {
          create: {
            planId: freePlan.id,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        }
      }
    });
  }
}

module.exports = new BrandRepository();
