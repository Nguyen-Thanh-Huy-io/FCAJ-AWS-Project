const prisma = require('../../config/prisma');
const { BILLING_CYCLES, SUBSCRIPTION_STATUS, SYSTEM_PLANS, DEFAULT_CONFIG } = require('../../utils/constants');

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
}

module.exports = new BrandRepository();
