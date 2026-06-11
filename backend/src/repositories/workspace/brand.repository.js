const prisma = require('../../config/prisma');
const { BILLING_CYCLES, SUBSCRIPTION_STATUS, SYSTEM_PLANS, DEFAULT_CONFIG } = require('../../utils/constants');

class BrandRepository {
  async findManyByUserId(userId) {
    return await prisma.brand.findMany({
      where: {
        deletedAt: null,
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
    return await prisma.brand.findFirst({
      where: { id, deletedAt: null },
      include: {
        socialAccounts: true
      }
    });
  }

  async countActiveBrandsByOwnerId(ownerId) {
    return await prisma.brand.count({
      where: {
        ownerId,
        deletedAt: null
      }
    });
  }

  async create(data) {
    // Find a free plan to assign as default
    const freePlan = await prisma.plan.findFirst({
      where: { name: SYSTEM_PLANS.FREE, billingCycle: BILLING_CYCLES.MONTHLY }
    });

    if (!freePlan) {
      throw new Error('Default FREE plan not found in database. Please run seed script.');
    }

    return await prisma.brand.create({
      data: {
        name: data.name,
        timezone: data.timezone || DEFAULT_CONFIG.TIMEZONE,
        defaultLanguage: data.defaultLanguage || DEFAULT_CONFIG.LANGUAGE,
        owner: {
          connect: { id: data.ownerId }
        },
        subscription: {
          create: {
            planId: freePlan.id,
            status: SUBSCRIPTION_STATUS.ACTIVE,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        }
      }
    });
  }

  async update(id, data) {
    return await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        timezone: data.timezone,
        defaultLanguage: data.defaultLanguage,
        logoUrl: data.logoUrl,
        updatedAt: new Date()
      }
    });
  }

  async delete(id) {
    return await prisma.brand.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date()
      }
    });
  }
}

module.exports = new BrandRepository();
